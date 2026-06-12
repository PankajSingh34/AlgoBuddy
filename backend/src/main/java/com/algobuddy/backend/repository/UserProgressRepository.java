package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUserId(UUID userId);
    Optional<UserProgress> findByUserIdAndProblemId(UUID userId, String problemId);
    
    List<UserProgress> findByUserIdAndProblemIdIn(UUID userId, List<String> problemIds);

    @Query("SELECT COUNT(u) FROM UserProgress u WHERE u.userId = :userId AND u.status = 'Completed' AND u.updatedAt >= :startTime")
    int countCompletedSince(@Param("userId") UUID userId, @Param("startTime") OffsetDateTime startTime);
}
