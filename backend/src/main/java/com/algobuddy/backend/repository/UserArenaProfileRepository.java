package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserArenaProfile;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserArenaProfileRepository extends JpaRepository<UserArenaProfile, UUID> {
    
    @Query("SELECT p FROM UserArenaProfile p ORDER BY p.rating DESC, p.xp DESC")
    List<UserArenaProfile> findTopPlayers(Pageable pageable);

    @Query(value = """
            SELECT rank FROM (
                SELECT user_id, RANK() OVER (ORDER BY rating DESC, xp DESC) as rank
                FROM user_arena_profiles
            ) ranked WHERE user_id = :userId
            """, nativeQuery = true)
    Integer findRankByUserId(@Param("userId") UUID userId);
}
