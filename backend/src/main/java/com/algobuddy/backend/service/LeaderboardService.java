package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.LeaderboardEntryDto;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserPracticeStatsRepository statsRepository;
    private final UserArenaProfileRepository arenaRepository;
    private final UserProfileRepository profileRepository;

    public List<LeaderboardEntryDto> getGlobalStreakLeaderboard() {
        List<UserPracticeStats> stats = statsRepository.findTop100ByOrderByCurrentStreakDesc();
        return mapToStreakEntries(stats);
    }

    public List<LeaderboardEntryDto> getGlobalArenaLeaderboard() {
        List<UserArenaProfile> profiles = arenaRepository.findTop100ByOrderByRatingDesc();
        return mapToArenaEntries(profiles);
    }

    private List<LeaderboardEntryDto> mapToStreakEntries(List<UserPracticeStats> statsList) {
        Set<UUID> userIds = statsList.stream().map(UserPracticeStats::getUserId).collect(Collectors.toSet());
        Map<UUID, UserProfile> profileMap = profileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, p -> p, (a, b) -> a));

        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (UserPracticeStats stat : statsList) {
            UserProfile profile = profileMap.get(stat.getUserId());
            result.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(stat.getUserId())
                    .username(profile != null ? profile.getUsername() : "Anonymous")
                    .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                    .score(stat.getCurrentStreak())
                    .build());
        }
        return result;
    }

    private List<LeaderboardEntryDto> mapToArenaEntries(List<UserArenaProfile> profilesList) {
        Set<UUID> userIds = profilesList.stream().map(UserArenaProfile::getUserId).collect(Collectors.toSet());
        Map<UUID, UserProfile> profileMap = profileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, p -> p, (a, b) -> a));

        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (UserArenaProfile arenaProfile : profilesList) {
            UserProfile profile = profileMap.get(arenaProfile.getUserId());
            result.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(arenaProfile.getUserId())
                    .username(profile != null ? profile.getUsername() : "Anonymous")
                    .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                    .score(arenaProfile.getRating())
                    .build());
        }
        return result;
    }
}
