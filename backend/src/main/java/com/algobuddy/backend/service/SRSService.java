package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.SRSReviewRequest;
import com.algobuddy.backend.entity.UserAlgorithmSRS;
import com.algobuddy.backend.repository.UserAlgorithmSRSRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SRSService {

    private final UserAlgorithmSRSRepository srsRepository;

    public List<UserAlgorithmSRS> getDueAlgorithms(UUID userId) {
        return srsRepository.findByUserIdAndNextReviewDateBefore(userId, OffsetDateTime.now());
    }

    @Transactional
    public UserAlgorithmSRS recordReview(UUID userId, SRSReviewRequest request) {
        UserAlgorithmSRS srs = srsRepository.findByUserIdAndAlgorithmId(userId, request.getAlgorithmId())
                .orElse(UserAlgorithmSRS.builder()
                        .userId(userId)
                        .algorithmId(request.getAlgorithmId())
                        .build());

        int quality = request.getQuality();
        int repetitions = srs.getRepetitions();
        double easeFactor = srs.getEaseFactor();
        int interval = srs.getIntervalDays();

        if (quality >= 3) {
            if (repetitions == 0) {
                interval = 1;
            } else if (repetitions == 1) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * easeFactor);
            }
            repetitions++;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        srs.setRepetitions(repetitions);
        srs.setIntervalDays(interval);
        srs.setEaseFactor(easeFactor);
        srs.setLastReviewed(OffsetDateTime.now());
        srs.setNextReviewDate(OffsetDateTime.now().plusDays(interval));

        return srsRepository.save(srs);
    }
}
