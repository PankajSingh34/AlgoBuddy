package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProgress;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticeService {

    private static final Logger log = LoggerFactory.getLogger(PracticeService.class);

    private final UserProgressRepository progressRepository;
    private final UserPracticeStatsRepository statsRepository;

    @Autowired
    private PracticeService self;

    @Transactional(readOnly = true)
    public ProgressResponse getUserProgress(UUID userId) {
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

        int dailySolved = 0;
        int weeklySolved = 0;
        int monthlySolved = 0;

        for (UserProgress p : progressList) {
            if ("Completed".equals(p.getStatus()) && p.getUpdatedAt() != null) {
                if (!p.getUpdatedAt().isBefore(startOfDay)) {
                    dailySolved++;
                }
                if (!p.getUpdatedAt().isBefore(startOfWeek)) {
                    weeklySolved++;
                }
                if (!p.getUpdatedAt().isBefore(startOfMonth)) {
                    monthlySolved++;
                }
            }
        }

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
    public ProgressResponse updateProgress(UUID userId, ProgressRequest request) {
        // 1. Update Problem Progress
        Optional<UserProgress> existingProgress = progressRepository.findByUserIdAndProblemId(userId, request.getProblemId());
        
        if (existingProgress.isPresent()) {
            UserProgress progress = existingProgress.get();
            progress.setStatus(request.getStatus());
            progress.setUpdatedAt(OffsetDateTime.now());
            progressRepository.save(progress);
        } else {
            UserProgress newProgress = new UserProgress();
            newProgress.setUserId(userId);
            newProgress.setProblemId(request.getProblemId());
            newProgress.setStatus(request.getStatus());
            newProgress.setUpdatedAt(OffsetDateTime.now());
            progressRepository.save(newProgress);
        }

        // 2. Update Daily Streak
        if ("Completed".equals(request.getStatus())) {
            self.updateStreakWithRetry(userId);
        }
        
        return getUserProgress(userId);
    }

    @Transactional
    public ProgressResponse bulkUpdateProgress(UUID userId, BulkProgressRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return getUserProgress(userId);
        }

        boolean anyCompleted = false;
        OffsetDateTime now = OffsetDateTime.now();

        for (BulkProgressRequest.Item item : request.getItems()) {
            if (item.getProblemId() == null || item.getStatus() == null) continue;

            Optional<UserProgress> existing = progressRepository.findByUserIdAndProblemId(userId, item.getProblemId());
            if (existing.isPresent()) {
                UserProgress progress = existing.get();
                progress.setStatus(item.getStatus());
                progress.setUpdatedAt(now);
                progressRepository.save(progress);
            } else {
                UserProgress newProgress = new UserProgress();
                newProgress.setUserId(userId);
                newProgress.setProblemId(item.getProblemId());
                newProgress.setStatus(item.getStatus());
                newProgress.setUpdatedAt(now);
                progressRepository.save(newProgress);
            }

            if ("Completed".equals(item.getStatus())) {
                anyCompleted = true;
            }
        }

        // Only update streak once even if multiple problems were completed
        if (anyCompleted) {
            self.updateStreakWithRetry(userId);
        }

        return getUserProgress(userId);
    }

    public void updateStreakWithRetry(UUID userId) {
        final int MAX_RETRIES = 3;
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                self.updateStreak(userId);
                return;
            } catch (ObjectOptimisticLockingFailureException e) {
                if (attempt == MAX_RETRIES) {
                    log.error("Failed to update streak for user {} after {} attempts", userId, MAX_RETRIES, e);
                    throw e;
                }
                log.warn("Optimistic lock failure for user {}, retry attempt {}/{}", userId, attempt, MAX_RETRIES);
            }
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStreak(UUID userId) {
        UserPracticeStats stats = statsRepository.findById(userId)
                .orElse(new UserPracticeStats(userId, 0, 0, null, 0));

        LocalDate today = LocalDate.now();
        LocalDate lastActive = stats.getLastActiveDate();

        if (lastActive == null) {
            stats.setCurrentStreak(1);
            stats.setLongestStreak(1);
        } else if (lastActive.equals(today.minusDays(1))) {
            // Consecutive day
            stats.setCurrentStreak(stats.getCurrentStreak() + 1);
            if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                stats.setLongestStreak(stats.getCurrentStreak());
            }
        } else if (!lastActive.equals(today)) {
            // Streak broken (not today and not yesterday)
            stats.setCurrentStreak(1);
        }
        // If lastActive == today, do nothing (streak already incremented today)

        stats.setLastActiveDate(today);
        statsRepository.save(stats);
    }
}
