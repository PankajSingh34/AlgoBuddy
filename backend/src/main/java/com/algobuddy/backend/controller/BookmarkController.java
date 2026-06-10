package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.BookmarkDto;
import com.algobuddy.backend.dto.BookmarkRequestDto;
import com.algobuddy.backend.entity.Bookmark;
import com.algobuddy.backend.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkRepository bookmarkRepository;

    @GetMapping
    public ResponseEntity<List<BookmarkDto>> getBookmarks(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        
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
                                            @RequestBody BookmarkRequestDto request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndProblemId(userId, request.getProblemId());
        if (existing.isEmpty()) {
            Bookmark bookmark = new Bookmark();
            bookmark.setUserId(userId);
            bookmark.setProblemId(request.getProblemId());
            bookmark.setTopicSlug(request.getTopicSlug());
            bookmarkRepository.save(bookmark);
        }
        
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> removeBookmark(@AuthenticationPrincipal Jwt jwt, 
                                               @RequestParam String problemId) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        bookmarkRepository.findByUserIdAndProblemId(userId, problemId)
                .ifPresent(bookmarkRepository::delete);
                
        return ResponseEntity.ok().build();
    }
}
