package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.SRSReviewRequest;
import com.algobuddy.backend.entity.UserAlgorithmSRS;
import com.algobuddy.backend.service.SRSService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/srs")
@RequiredArgsConstructor
@Tag(name = "SRS", description = "Endpoints for Spaced Repetition System")
public class SRSController {

    private final SRSService srsService;

    @GetMapping("/due")
    @Operation(summary = "Get due algorithms", description = "Get list of algorithms due for review today")
    public ResponseEntity<List<UserAlgorithmSRS>> getDueAlgorithms(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(srsService.getDueAlgorithms(userId));
    }

    @PostMapping("/review")
    @Operation(summary = "Record SRS review", description = "Record a review for an algorithm (quality 0-5)")
    public ResponseEntity<UserAlgorithmSRS> recordReview(@CurrentUserId UUID userId, @Valid @RequestBody SRSReviewRequest request) {
        return ResponseEntity.ok(srsService.recordReview(userId, request));
    }
}
