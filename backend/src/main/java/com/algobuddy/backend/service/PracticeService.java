package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProgress;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticeService {


    private final UserProgressRepository progressRepository;
    private final UserPracticeStatsRepository statsRepository;


    @Transactional(readOnly = true)
    public ProgressResponse getUserProgress(@NonNull UUID userId) {
        List<UserProgress> progressList = progressRepository.findByUserId(userId);
        
        Map<String, ProgressResponse.ProgressDetail> progressMap = progressList.stream()
                .collect(Collectors.toMap(
                        UserProgress::getProblemId, 
                        up -> new ProgressResponse.ProgressDetail(up.getStatus(), up.getUpdatedAt())
                ));

        UserPracticeStats stats = statsRepository.findById(userId)
                .orElse(new UserPracticeStats(userId, 0, 0, null, 0));

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime startOfDay = now.toLocalDate().atStartOfDay(now.getOffset()).toOffsetDateTime();
        OffsetDateTime startOfWeek = now.toLocalDate().with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay(now.getOffset()).toOffsetDateTime();
        OffsetDateTime startOfMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay(now.getOffset()).toOffsetDateTime();

        int dailySolved = progressRepository.countCompletedSince(userId, startOfDay);
        int weeklySolved = progressRepository.countCompletedSince(userId, startOfWeek);
        int monthlySolved = progressRepository.countCompletedSince(userId, startOfMonth);

        return ProgressResponse.builder()
                .progress(progressMap)
                .currentStreak(stats.getCurrentStreak())
                .longestStreak(stats.getLongestStreak())
                .visualizedCount(stats.getVisualizedCount())
                .dailySolved(dailySolved)
                .weeklySolved(weeklySolved)
                .monthlySolved(monthlySolved)
                .build();
    }

    @Transactional
    public ProgressResponse updateProgress(@NonNull UUID userId, ProgressRequest request) {
        progressRepository.upsertProgress(userId, request.getProblemId(), request.getStatus());

        if ("Completed".equals(request.getStatus())) {
            updateStreak(userId);
        }

        return getUserProgress(userId);
    }

    @Transactional
    public ProgressResponse bulkUpdateProgress(@NonNull UUID userId, BulkProgressRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return getUserProgress(userId);
        }

        List<BulkProgressRequest.Item> validItems = request.getItems().stream()
                .filter(item -> item.getProblemId() != null && !item.getProblemId().trim().isEmpty() && item.getStatus() != null)
                .toList();

        if (validItems.isEmpty()) {
            return getUserProgress(userId);
        }

        List<String> problemIds = validItems.stream().map(BulkProgressRequest.Item::getProblemId).toList();
        List<UserProgress> existingProgress = progressRepository.findByUserIdAndProblemIdIn(userId, problemIds);

        Map<String, UserProgress> existingProgressMap = existingProgress.stream()
                .collect(Collectors.toMap(UserProgress::getProblemId, p -> p));

        List<UserProgress> toSave = new java.util.ArrayList<>();
        boolean anyCompleted = false;

        for (BulkProgressRequest.Item item : validItems) {
            UserProgress progress = existingProgressMap.get(item.getProblemId());
            if (progress != null) {
                progress.setStatus(item.getStatus());
                progress.setUpdatedAt(OffsetDateTime.now());
            } else {
                progress = new UserProgress();
                progress.setUserId(userId);
                progress.setProblemId(item.getProblemId());
                progress.setStatus(item.getStatus());
                progress.setUpdatedAt(OffsetDateTime.now());
            }
            toSave.add(progress);

            if ("Completed".equals(item.getStatus())) {
                anyCompleted = true;
            }
        }

        progressRepository.saveAll(toSave);

        if (anyCompleted) {
            updateStreak(userId);
        }

        return getUserProgress(userId);
    }

    @Transactional
    public void updateStreak(@NonNull UUID userId) {
        statsRepository.acquireStreakUpdateLock(userId);
        statsRepository.upsertStreakAtomic(userId, LocalDate.now());
    }
}
