package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.service.FriendshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@Tag(name = "Friends", description = "Endpoints for managing user friendships")
public class FriendshipController {

    private final FriendshipService friendshipService;

    @GetMapping
    @Operation(summary = "Get friends", description = "Get list of friend profiles")
    public ResponseEntity<List<UserProfile>> getFriends(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(friendshipService.getFriends(userId));
    }

    @PostMapping("/{friendId}")
    @Operation(summary = "Add friend", description = "Add a user to friends list")
    public ResponseEntity<Void> addFriend(@CurrentUserId UUID userId, @PathVariable UUID friendId) {
        friendshipService.addFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{friendId}")
    @Operation(summary = "Remove friend", description = "Remove a user from friends list")
    public ResponseEntity<Void> removeFriend(@CurrentUserId UUID userId, @PathVariable UUID friendId) {
        friendshipService.removeFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }
}
