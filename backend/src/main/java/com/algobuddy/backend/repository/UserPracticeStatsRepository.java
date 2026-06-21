package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserPracticeStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface UserPracticeStatsRepository extends JpaRepository<UserPracticeStats, UUID> {

    @Query(value = "SELECT pg_advisory_xact_lock(hashtext('streak_update:' || :userId::text)::bigint)", nativeQuery = true)
    void acquireStreakUpdateLock(@Param("userId") UUID userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO user_practice_stats (user_id, current_streak, longest_streak, last_active_date, visualized_count)
        VALUES (:userId, 1, 1, CAST(:today AS DATE), 0)
        ON CONFLICT (user_id) DO UPDATE SET
            current_streak = CASE 
                WHEN user_practice_stats.last_active_date = CAST(:today AS DATE) THEN user_practice_stats.current_streak
                WHEN user_practice_stats.last_active_date = CAST(:today AS DATE) - INTERVAL '1 day' THEN user_practice_stats.current_streak + 1
                ELSE 1
            END,
            longest_streak = GREATEST(
                user_practice_stats.longest_streak,
                CASE 
                    WHEN user_practice_stats.last_active_date = CAST(:today AS DATE) THEN user_practice_stats.current_streak
                    WHEN user_practice_stats.last_active_date = CAST(:today AS DATE) - INTERVAL '1 day' THEN user_practice_stats.current_streak + 1
                    ELSE 1
                END
            ),
            last_active_date = CAST(:today AS DATE)
        """, nativeQuery = true)
    void upsertStreakAtomic(@Param("userId") UUID userId, @Param("today") LocalDate today);
}
