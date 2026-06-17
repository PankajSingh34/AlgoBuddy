package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaMatchResponse;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.entity.ArenaMatch;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArenaService {

    private static final Logger log = LoggerFactory.getLogger(ArenaService.class);

    private final UserArenaProfileRepository profileRepository;
    private final ArenaMatchRepository matchRepository;

    private final Map<UUID, Bucket> matchResultRateLimitCache = new ConcurrentHashMap<>();

    private Bucket newMatchResultBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(3)
                .refillGreedy(3, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private void checkMatchResultRateLimit(UUID userId) {
        Bucket bucket = matchResultRateLimitCache.computeIfAbsent(userId, k -> newMatchResultBucket());
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            throw new IllegalStateException("Rate limit exceeded. Max 3 match results per minute.");
        }
    }

    @Transactional
    @Cacheable(value = "arenaProfile", key = "#userId", unless = "#result == null")
    public ArenaProfileResponse getProfile(UUID userId) {
        UserArenaProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        
        Integer rank = calculateRank(userId);
        
        return mapToResponse(profile, rank);
    }
    
    @Transactional(readOnly = true)
    @Cacheable(value = "arenaLeaderboard", unless = "#result == null")
    public List<ArenaProfileResponse> getLeaderboard() {
        List<UserArenaProfile> topPlayers = profileRepository.findTopPlayers(PageRequest.of(0, 50));
        
        int rank = 1;
        List<ArenaProfileResponse> result = new java.util.ArrayList<>();
        for (UserArenaProfile profile : topPlayers) {
            result.add(mapToResponse(profile, rank++));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<ArenaMatchResponse> getMatchHistory(UUID userId) {
        List<ArenaMatch> recentMatches = matchRepository.findRecentMatchesByUserId(userId, PageRequest.of(0, 5));
        
        return recentMatches.stream()
                .map(match -> mapToMatchResponse(match, userId))
                .collect(Collectors.toList());
    }

    private UserArenaProfile createDefaultProfile(UUID userId) {
        UserArenaProfile newProfile = UserArenaProfile.builder()
                .userId(userId)
                .xp(0)
                .level(1)
                .rating(1200)
                .battlesWon(0)
                .battlesLost(0)
                .totalProblemsSolved(0)
                .build();
        return profileRepository.save(newProfile);
    }
    
    private Integer calculateRank(UUID userId) {
        Integer rank = profileRepository.findRankByUserId(userId);
        return rank != null ? rank : profileRepository.findTopPlayers(PageRequest.of(0, 1)).size() + 1;
    }

    private ArenaProfileResponse mapToResponse(UserArenaProfile profile, Integer rank) {
        return ArenaProfileResponse.builder()
                .userId(profile.getUserId())
                .xp(profile.getXp())
                .level(profile.getLevel())
                .rating(profile.getRating())
                .battlesWon(profile.getBattlesWon())
                .battlesLost(profile.getBattlesLost())
                .totalProblemsSolved(profile.getTotalProblemsSolved())
                .rank(rank)
                .build();
    }

    private ArenaMatchResponse mapToMatchResponse(ArenaMatch match, UUID requestingUserId) {
        boolean isPlayer1 = match.getPlayer1Id().equals(requestingUserId);
        UUID opponentId = isPlayer1 ? match.getPlayer2Id() : match.getPlayer1Id();
        
        String result = "In Progress";
        if (match.getWinnerId() != null) {
            result = match.getWinnerId().equals(requestingUserId) ? "Victory" : "Defeat";
        } else if (match.getEndTime() != null) {
            result = "Draw";
        }
        
        return ArenaMatchResponse.builder()
                .id(match.getId())
                .opponentName("User " + opponentId.toString().substring(0, 4))
                .topic(match.getTopic())
                .difficulty(match.getDifficulty())
                .startTime(match.getStartTime())
                .result(result)
                .ratingChange(isPlayer1 ? match.getRatingChangeP1() : match.getRatingChangeP2())
                .xpAwarded(isPlayer1 ? match.getXpAwardedP1() : match.getXpAwardedP2())
                .build();
    }

    @Transactional
    public void initMatch(UUID requestingUserId, com.algobuddy.backend.dto.InitMatchRequest request) {
        if (request.getMatchId() == null || request.getMatchId().isEmpty()) {
            throw new IllegalArgumentException("matchId is required");
        }

        if (matchRepository.findByMatchId(request.getMatchId()).isPresent()) {
            return;
        }

        ArenaMatch match = ArenaMatch.builder()
                .matchId(request.getMatchId())
                .player1Id(requestingUserId)
                .player2Id(request.getOpponentId())
                .topic(request.getTopic() != null ? request.getTopic() : "Arrays")
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : "Easy")
                .startTime(java.time.LocalDateTime.now())
                .build();

        matchRepository.save(match);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "arenaProfile", key = "#requestingUserId"),
        @CacheEvict(value = "arenaProfile", key = "#request.opponentId"),
        @CacheEvict(value = "arenaLeaderboard", allEntries = true)
    })
    public void recordMatchResult(UUID requestingUserId, com.algobuddy.backend.dto.RecordMatchRequest request) {
        checkMatchResultRateLimit(requestingUserId);

        String matchIdStr = request.getMatchId();
        if (matchIdStr == null || matchIdStr.isEmpty()) {
            throw new IllegalArgumentException("matchId is required");
        }

        ArenaMatch existingMatch = matchRepository.findByMatchId(matchIdStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid match ID"));

        if (!existingMatch.getPlayer1Id().equals(requestingUserId) &&
            !existingMatch.getPlayer2Id().equals(requestingUserId)) {
            throw new SecurityException("User is not a participant in this match");
        }

        UUID opponentId = request.getOpponentId();
        if (!existingMatch.getPlayer1Id().equals(opponentId) &&
            !existingMatch.getPlayer2Id().equals(opponentId)) {
            throw new SecurityException("Opponent is not a participant in this match");
        }

        if (existingMatch.getWinnerId() != null) {
            throw new IllegalArgumentException("Match result has already been recorded");
        }

        boolean isWinner = request.isWinner();

        final int MAX_RETRIES = 3;
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                // Deadlock Prevention: Always lock rows in the same order
                UUID firstId = requestingUserId.compareTo(opponentId) < 0 ? requestingUserId : opponentId;
                UUID secondId = requestingUserId.compareTo(opponentId) < 0 ? opponentId : requestingUserId;

                UserArenaProfile firstProfile = profileRepository.findById(firstId)
                        .orElseGet(() -> createDefaultProfile(firstId));
                UserArenaProfile secondProfile = profileRepository.findById(secondId)
                        .orElseGet(() -> createDefaultProfile(secondId));

                UserArenaProfile p1Profile = requestingUserId.equals(firstId) ? firstProfile : secondProfile;
                UserArenaProfile p2Profile = opponentId.equals(firstId) ? firstProfile : secondProfile;

                int p1RatingChange = isWinner ? 25 : -15;
                int p2RatingChange = isWinner ? -15 : 25;

                int p1XpAwarded = isWinner ? 50 : 10;
                int p2XpAwarded = isWinner ? 10 : 50;

                p1Profile.setRating(Math.max(0, p1Profile.getRating() + p1RatingChange));
                p1Profile.setXp(p1Profile.getXp() + p1XpAwarded);
                p1Profile.setLevel((p1Profile.getXp() / 1000) + 1);
                p1Profile.setTotalProblemsSolved(p1Profile.getTotalProblemsSolved() + (isWinner ? 1 : 0));
                if (isWinner) p1Profile.setBattlesWon(p1Profile.getBattlesWon() + 1);
                else p1Profile.setBattlesLost(p1Profile.getBattlesLost() + 1);

                p2Profile.setRating(Math.max(0, p2Profile.getRating() + p2RatingChange));
                p2Profile.setXp(p2Profile.getXp() + p2XpAwarded);
                p2Profile.setLevel((p2Profile.getXp() / 1000) + 1);
                p2Profile.setTotalProblemsSolved(p2Profile.getTotalProblemsSolved() + (!isWinner ? 1 : 0));
                if (!isWinner) p2Profile.setBattlesWon(p2Profile.getBattlesWon() + 1);
                else p2Profile.setBattlesLost(p2Profile.getBattlesLost() + 1);

                profileRepository.save(firstProfile);
                profileRepository.save(secondProfile);

                existingMatch.setWinnerId(isWinner ? requestingUserId : opponentId);
                existingMatch.setEndTime(java.time.LocalDateTime.now());
                matchRepository.save(existingMatch);

                return;
            } catch (ObjectOptimisticLockingFailureException | DataIntegrityViolationException e) {
                if (attempt == MAX_RETRIES) {
                    log.error("Failed to record match result after {} attempts", MAX_RETRIES, e);
                    throw e;
                }
                log.warn("Optimistic lock failure recording match result, retry {}/{}", attempt, MAX_RETRIES);
            }
        }
    }

    @Transactional(readOnly = true)
    public com.algobuddy.backend.dto.DailyChallengeResponse getDailyChallenge() {
        // Hardcoded list of challenges to simulate a rotating daily problem
        List<com.algobuddy.backend.dto.DailyChallengeResponse> pool = List.of(
            new com.algobuddy.backend.dto.DailyChallengeResponse("valid-anagram", "Valid Anagram", "Solve this classic string problem to earn bonus daily XP and a special profile badge.", "Easy", "Strings", 250),
            new com.algobuddy.backend.dto.DailyChallengeResponse("two-sum", "Two Sum", "Find two numbers in the array that add up to the target value.", "Easy", "Arrays", 200),
            new com.algobuddy.backend.dto.DailyChallengeResponse("lru-cache", "LRU Cache", "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", "Medium", "Design", 400),
            new com.algobuddy.backend.dto.DailyChallengeResponse("merge-intervals", "Merge Intervals", "Merge all overlapping intervals into one.", "Medium", "Arrays", 350)
        );

        long daysSinceEpoch = java.time.LocalDate.now().toEpochDay();
        int index = (int) (daysSinceEpoch % pool.size());
        
        return pool.get(index);
    }
}
