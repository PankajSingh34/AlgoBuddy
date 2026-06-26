package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    List<Friendship> findByUserId(UUID userId);
    boolean existsByUserIdAndFriendId(UUID userId, UUID friendId);
    void deleteByUserIdAndFriendId(UUID userId, UUID friendId);
}
