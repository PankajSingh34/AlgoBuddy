package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;

    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(@AuthenticationPrincipal Jwt jwt) {
        // Supabase JWT Subject (sub) is the user UUID
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(practiceService.getUserProgress(userId));
    }

    @PostMapping("/progress")
    public ResponseEntity<ProgressResponse> updateProgress(@AuthenticationPrincipal Jwt jwt, 
                                                           @RequestBody ProgressRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        ProgressResponse response = practiceService.updateProgress(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/progress/bulk")
    public ResponseEntity<ProgressResponse> bulkUpdateProgress(@AuthenticationPrincipal Jwt jwt,
                                                               @RequestBody BulkProgressRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        ProgressResponse response = practiceService.bulkUpdateProgress(userId, request);
        return ResponseEntity.ok(response);
    }
}
