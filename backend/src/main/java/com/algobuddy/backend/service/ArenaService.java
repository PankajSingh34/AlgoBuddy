package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaMatchResponse;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.entity.ArenaMatch;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArenaService {

    private final UserArenaProfileRepository profileRepository;
    private final ArenaMatchRepository matchRepository;

    @Transactional
    public ArenaProfileResponse getProfile(UUID userId) {
        UserArenaProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        
        Integer rank = calculateRank(userId);
        
        return mapToResponse(profile, rank);
    }
    
    @Transactional(readOnly = true)
    public List<ArenaProfileResponse> getLeaderboard() {
        List<UserArenaProfile> topPlayers = profileRepository.findTopPlayers();
        
        // Return top 50, assigning ranks 1 to 50
        return topPlayers.stream()
                .limit(50)
                .map(profile -> {
                    int rank = topPlayers.indexOf(profile) + 1;
                    return mapToResponse(profile, rank);
                })
                .collect(Collectors.toList());
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
        // Simple rank calculation: find position in the ordered list
        List<UserArenaProfile> allPlayers = profileRepository.findTopPlayers();
        for (int i = 0; i < allPlayers.size(); i++) {
            if (allPlayers.get(i).getUserId().equals(userId)) {
                return i + 1; // 1-indexed rank
            }
        }
        return allPlayers.size() + 1; // If not found, rank is last
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
    public void recordMatchResult(UUID requestingUserId, com.algobuddy.backend.dto.RecordMatchRequest request) {
        if (request.getMatchId() != null && !request.getMatchId().isEmpty()) {
            // Check if match is already recorded to prevent double updates if both clients send the request
            // Note: Since matchId is stored locally or partially, and we don't have a matchId column in ArenaMatch right now,
            // we will just proceed. A real robust app would check an indexed matchId column.
            // For now, we only trigger the API from the winner's side in the frontend to avoid double updates.
        }
        
        UUID opponentId = request.getOpponentId();
        boolean isWinner = request.isWinner();
        
        UserArenaProfile p1Profile = profileRepository.findById(requestingUserId).orElseGet(() -> createDefaultProfile(requestingUserId));
        UserArenaProfile p2Profile = profileRepository.findById(opponentId).orElseGet(() -> createDefaultProfile(opponentId));

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

        profileRepository.save(p1Profile);
        profileRepository.save(p2Profile);

        ArenaMatch match = ArenaMatch.builder()
                .player1Id(requestingUserId)
                .player2Id(opponentId)
                .winnerId(isWinner ? requestingUserId : opponentId)
                .topic(request.getTopic() != null ? request.getTopic() : "Arrays")
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : "Easy")
                .startTime(java.time.LocalDateTime.now().minusMinutes(3)) 
                .endTime(java.time.LocalDateTime.now())
                .ratingChangeP1(p1RatingChange)
                .ratingChangeP2(p2RatingChange)
                .xpAwardedP1(p1XpAwarded)
                .xpAwardedP2(p2XpAwarded)
                .build();
        
        matchRepository.save(match);
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
