package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.MySheetDto;
import com.algobuddy.backend.dto.MySheetRequestDto;
import com.algobuddy.backend.dto.MySheetResponseDto;
import com.algobuddy.backend.entity.MySheet;
import com.algobuddy.backend.service.MySheetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/v1/mysheet")
@RequiredArgsConstructor
@Validated
public class MySheetController {

    private final MySheetService mySheetService;

    @GetMapping
    public ResponseEntity<MySheetResponseDto> getMySheet(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<MySheet> items = mySheetService.getMySheet(userId);

        List<MySheetDto> dtos = items.stream()
                .map(item -> MySheetDto.builder()
                        .problemId(item.getProblemId())
                        .note(item.getNote())
                        .addedAt(item.getAddedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(MySheetResponseDto.builder().items(dtos).build());
    }

    @PostMapping
    public ResponseEntity<Void> addToSheet(@AuthenticationPrincipal Jwt jwt,
                                           @Valid @RequestBody MySheetRequestDto request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        mySheetService.addToSheet(userId, request.getProblemId(), request.getNote());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromSheet(@AuthenticationPrincipal Jwt jwt,
                                                @NotBlank(message = "problemId cannot be empty") @RequestParam String problemId) {
        UUID userId = UUID.fromString(jwt.getSubject());

        mySheetService.removeFromSheet(userId, problemId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/shared/{userId}")
    public ResponseEntity<MySheetResponseDto> getSharedSheet(@PathVariable UUID userId) {
        List<MySheet> items = mySheetService.getMySheet(userId);

        List<MySheetDto> dtos = items.stream()
                .map(item -> MySheetDto.builder()
                        .problemId(item.getProblemId())
                        .note(item.getNote())
                        .addedAt(item.getAddedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(MySheetResponseDto.builder().items(dtos).build());
    }

    @PostMapping("/clone/{sharedUserId}")
    public ResponseEntity<Void> cloneSharedSheet(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID sharedUserId) {
        UUID userId = UUID.fromString(jwt.getSubject());
        mySheetService.cloneSheet(sharedUserId, userId);
        return ResponseEntity.ok().build();
    }
}
