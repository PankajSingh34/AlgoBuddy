package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.LeaderboardEntryDto;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserPracticeStatsRepository statsRepository;
    private final UserArenaProfileRepository arenaRepository;

    public List<LeaderboardEntryDto> getGlobalStreakLeaderboard() {
        List<LeaderboardEntryDto> entries = statsRepository.findTop100StreakLeaderboard(org.springframework.data.domain.PageRequest.of(0, 100));
        int rank = 1;
        for (LeaderboardEntryDto entry : entries) {
            entry.setRank(rank++);
        }
        return entries;
    }

    public List<LeaderboardEntryDto> getGlobalArenaLeaderboard() {
        List<LeaderboardEntryDto> entries = arenaRepository.findTop100ArenaLeaderboard(org.springframework.data.domain.PageRequest.of(0, 100));
        int rank = 1;
        for (LeaderboardEntryDto entry : entries) {
            entry.setRank(rank++);
        }
        return entries;
    }
}
