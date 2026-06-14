package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.service.ArenaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/arena")
@RequiredArgsConstructor
public class ArenaController {

    private final ArenaService arenaService;

    @GetMapping("/profile")
    public ResponseEntity<ArenaProfileResponse> getProfile(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(arenaService.getProfile(userId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<ArenaProfileResponse>> getLeaderboard() {
        return ResponseEntity.ok(arenaService.getLeaderboard());
    }

    @GetMapping("/history")
    public ResponseEntity<List<com.algobuddy.backend.dto.ArenaMatchResponse>> getMatchHistory(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(arenaService.getMatchHistory(userId));
    }

    @GetMapping("/daily-challenge")
    public ResponseEntity<com.algobuddy.backend.dto.DailyChallengeResponse> getDailyChallenge() {
        return ResponseEntity.ok(arenaService.getDailyChallenge());
    }

    @org.springframework.web.bind.annotation.PostMapping("/match-result")
    public ResponseEntity<String> recordMatchResult(@AuthenticationPrincipal Jwt jwt, @org.springframework.web.bind.annotation.RequestBody com.algobuddy.backend.dto.RecordMatchRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        arenaService.recordMatchResult(userId, request);
        return ResponseEntity.ok("Match result recorded successfully");
    }
}
