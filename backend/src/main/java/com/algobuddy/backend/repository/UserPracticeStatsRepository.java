package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserPracticeStats;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPracticeStatsRepository extends JpaRepository<UserPracticeStats, UUID> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<UserPracticeStats> findById(UUID id);
}
