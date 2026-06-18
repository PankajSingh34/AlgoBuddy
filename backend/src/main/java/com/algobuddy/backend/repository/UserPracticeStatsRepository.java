package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserPracticeStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserPracticeStatsRepository extends JpaRepository<UserPracticeStats, UUID> {
}
