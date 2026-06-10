package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.MySheetDto;
import com.algobuddy.backend.dto.MySheetRequestDto;
import com.algobuddy.backend.dto.MySheetResponseDto;
import com.algobuddy.backend.entity.MySheet;
import com.algobuddy.backend.repository.MySheetRepository;
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
@RequestMapping("/api/v1/mysheet")
@RequiredArgsConstructor
public class MySheetController {

    private final MySheetRepository mySheetRepository;

    @GetMapping
    public ResponseEntity<MySheetResponseDto> getMySheet(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<MySheet> items = mySheetRepository.findByUserId(userId);

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
                                           @RequestBody MySheetRequestDto request) {
        UUID userId = UUID.fromString(jwt.getSubject());

        Optional<MySheet> existing = mySheetRepository.findByUserIdAndProblemId(userId, request.getProblemId());
        if (existing.isPresent()) {
            MySheet item = existing.get();
            item.setNote(request.getNote());
            // Added at is updated on client or not, but let's keep added_at intact or updated.
            mySheetRepository.save(item);
        } else {
            MySheet item = new MySheet();
            item.setUserId(userId);
            item.setProblemId(request.getProblemId());
            item.setNote(request.getNote());
            // added_at is defaulted by database (DEFAULT now())
            mySheetRepository.save(item);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromSheet(@AuthenticationPrincipal Jwt jwt,
                                                @RequestParam String problemId) {
        UUID userId = UUID.fromString(jwt.getSubject());

        mySheetRepository.findByUserIdAndProblemId(userId, problemId)
                .ifPresent(mySheetRepository::delete);

        return ResponseEntity.ok().build();
    }
}
