package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.ArenaMatch;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArenaMatchRepository extends JpaRepository<ArenaMatch, UUID> {
    
    @Query("SELECT m FROM ArenaMatch m WHERE m.player1Id = :userId OR m.player2Id = :userId ORDER BY m.startTime DESC")
    List<ArenaMatch> findRecentMatchesByUserId(@Param("userId") UUID userId, Pageable pageable);

    java.util.Optional<ArenaMatch> findByMatchId(String matchId);

    boolean existsByMatchId(String matchId);

    @Query("SELECT COUNT(m) FROM ArenaMatch m WHERE (m.player1Id = :userId OR m.player2Id = :userId) AND m.endTime IS NOT NULL AND m.endTime >= :since")
    long countRecentMatchResultsByUserId(@Param("userId") UUID userId, @Param("since") java.time.LocalDateTime since);
}
