package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserAlgorithmSRS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAlgorithmSRSRepository extends JpaRepository<UserAlgorithmSRS, UUID> {
    Optional<UserAlgorithmSRS> findByUserIdAndAlgorithmId(UUID userId, String algorithmId);
    List<UserAlgorithmSRS> findByUserIdAndNextReviewDateBefore(UUID userId, OffsetDateTime date);
}
