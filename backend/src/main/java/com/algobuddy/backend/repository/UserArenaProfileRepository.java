package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserArenaProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserArenaProfileRepository extends JpaRepository<UserArenaProfile, UUID> {
    
    @Query("SELECT p FROM UserArenaProfile p ORDER BY p.rating DESC, p.xp DESC")
    List<UserArenaProfile> findTopPlayers();
}
