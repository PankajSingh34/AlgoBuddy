package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProgress;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PracticeServiceTest {

    @Mock
    private UserProgressRepository progressRepository;

    @Mock
    private UserPracticeStatsRepository statsRepository;

    private PracticeService practiceService;

    @BeforeEach
    void setUp() {
        practiceService = new PracticeService(progressRepository, statsRepository);
        ReflectionTestUtils.setField(practiceService, "self", practiceService);
    }

    @Test
    void updateProgressUsesUpsertInsteadOfLookupThenSave() {
        UUID userId = UUID.randomUUID();
        ProgressRequest request = new ProgressRequest();
        request.setProblemId("two-sum");
        request.setStatus("In Progress");

        when(progressRepository.findByUserId(userId)).thenReturn(List.of());
        when(progressRepository.countCompletedSince(org.mockito.ArgumentMatchers.eq(userId), org.mockito.ArgumentMatchers.any(OffsetDateTime.class)))
                .thenReturn(0);
        when(statsRepository.findById(userId)).thenReturn(Optional.empty());

        ProgressResponse response = practiceService.updateProgress(userId, request);

        verify(progressRepository).upsertProgress(userId, "two-sum", "In Progress");
        verify(progressRepository, never()).findByUserIdAndProblemId(userId, "two-sum");
        verify(progressRepository, never()).save(any(UserProgress.class));
        verify(progressRepository, never()).saveAll(any(Iterable.class));
        assertThat(response.getProgress()).isEmpty();
    }

    @Test
    void bulkUpdateProgressUpsertsEachValidItemAndTriggersStreakOnce() {
        UUID userId = UUID.randomUUID();

        BulkProgressRequest.Item completed = new BulkProgressRequest.Item();
        completed.setProblemId("two-sum");
        completed.setStatus("Completed");

        BulkProgressRequest.Item skipped = new BulkProgressRequest.Item();
        skipped.setProblemId("   ");
        skipped.setStatus("Ignored");

        BulkProgressRequest request = new BulkProgressRequest();
        request.setItems(List.of(completed, skipped));

        when(progressRepository.findByUserId(userId)).thenReturn(List.of());
        when(progressRepository.countCompletedSince(org.mockito.ArgumentMatchers.eq(userId), org.mockito.ArgumentMatchers.any(OffsetDateTime.class)))
                .thenReturn(0);
        when(statsRepository.findById(userId)).thenReturn(Optional.empty());
        when(statsRepository.save(org.mockito.ArgumentMatchers.any(UserPracticeStats.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProgressResponse response = practiceService.bulkUpdateProgress(userId, request);

        verify(progressRepository).upsertProgress(userId, "two-sum", "Completed");
        verify(progressRepository, never()).findByUserIdAndProblemIdIn(any(UUID.class), anyList());
        verify(progressRepository, never()).saveAll(any(Iterable.class));
        verify(statsRepository).save(any(UserPracticeStats.class));
        assertThat(response.getProgress()).isEmpty();
    }
}
