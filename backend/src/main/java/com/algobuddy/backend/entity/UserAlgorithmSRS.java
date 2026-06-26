package com.algobuddy.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.UUID;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_algorithm_srs", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "algorithm_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAlgorithmSRS {

    @Id
    @Column(columnDefinition = "uuid")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "algorithm_id", nullable = false)
    private String algorithmId;

    @Column(name = "next_review_date", nullable = false)
    private OffsetDateTime nextReviewDate;

    @Column(name = "interval_days")
    @Builder.Default
    private Integer intervalDays = 0;

    @Column(name = "ease_factor")
    @Builder.Default
    private Double easeFactor = 2.5;

    @Column(name = "repetitions")
    @Builder.Default
    private Integer repetitions = 0;

    @Column(name = "last_reviewed")
    private OffsetDateTime lastReviewed;
}
