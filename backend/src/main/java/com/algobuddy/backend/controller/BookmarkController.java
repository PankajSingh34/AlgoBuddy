package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.BookmarkDto;
import com.algobuddy.backend.dto.BookmarkRequestDto;
import com.algobuddy.backend.entity.Bookmark;
import com.algobuddy.backend.service.BookmarkService;
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
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
@Validated
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<List<BookmarkDto>> getBookmarks(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<Bookmark> bookmarks = bookmarkService.getBookmarks(userId);
        
        List<BookmarkDto> dtos = bookmarks.stream()
                .map(b -> BookmarkDto.builder()
                        .problemId(b.getProblemId())
                        .topicSlug(b.getTopicSlug())
                        .createdAt(b.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<Void> addBookmark(@AuthenticationPrincipal Jwt jwt, 
                                            @Valid @RequestBody BookmarkRequestDto request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        bookmarkService.addBookmark(userId, request.getProblemId(), request.getTopicSlug());
        
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> removeBookmark(@AuthenticationPrincipal Jwt jwt, 
                                               @NotBlank(message = "problemId cannot be empty") @RequestParam String problemId) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        bookmarkService.removeBookmark(userId, problemId);
                
        return ResponseEntity.ok().build();
    }
}
