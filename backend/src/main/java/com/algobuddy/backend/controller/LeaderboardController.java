package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.LeaderboardEntryDto;
import com.algobuddy.backend.service.LeaderboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Endpoints for fetching global and friend leaderboards")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/global/streak")
    @Operation(summary = "Global streak leaderboard", description = "Top users by streak")
    public ResponseEntity<List<LeaderboardEntryDto>> getGlobalStreak() {
        return ResponseEntity.ok(leaderboardService.getGlobalStreakLeaderboard());
    }

    @GetMapping("/global/arena")
    @Operation(summary = "Global arena leaderboard", description = "Top users by ELO rating")
    public ResponseEntity<List<LeaderboardEntryDto>> getGlobalArena() {
        return ResponseEntity.ok(leaderboardService.getGlobalArenaLeaderboard());
    }

    @GetMapping("/friends/streak")
    @Operation(summary = "Friends streak leaderboard", description = "Top friends by streak")
    public ResponseEntity<List<LeaderboardEntryDto>> getFriendsStreak(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(leaderboardService.getFriendsStreakLeaderboard(userId));
    }

    @GetMapping("/friends/arena")
    @Operation(summary = "Friends arena leaderboard", description = "Top friends by ELO rating")
    public ResponseEntity<List<LeaderboardEntryDto>> getFriendsArena(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(leaderboardService.getFriendsArenaLeaderboard(userId));
    }
}
