package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.Friendship;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.repository.FriendshipRepository;
import com.algobuddy.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public void addFriend(UUID userId, UUID friendId) {
        if (userId.equals(friendId)) return;
        if (!friendshipRepository.existsByUserIdAndFriendId(userId, friendId)) {
            friendshipRepository.save(Friendship.builder()
                    .userId(userId)
                    .friendId(friendId)
                    .build());
        }
    }

    @Transactional
    public void removeFriend(UUID userId, UUID friendId) {
        friendshipRepository.deleteByUserIdAndFriendId(userId, friendId);
    }

    public List<UserProfile> getFriends(UUID userId) {
        return friendshipRepository.findByUserId(userId).stream()
                .map(f -> userProfileRepository.findById(f.getFriendId()).orElse(null))
                .filter(profile -> profile != null)
                .collect(Collectors.toList());
    }
}
