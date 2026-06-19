package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ArenaServiceUnitTest {

    private UserArenaProfileRepository profileRepository;
    private ArenaMatchRepository matchRepository;
    private ArenaService arenaService;

    @BeforeEach
    public void setUp() {
        profileRepository = mock(UserArenaProfileRepository.class);
        matchRepository = mock(ArenaMatchRepository.class);
        arenaService = new ArenaService(profileRepository, matchRepository);
    }

    @Test
    public void testGetProfileReturnsCorrectRank() {
        UUID userId = UUID.randomUUID();
        UserArenaProfile profile = UserArenaProfile.builder()
                .userId(userId)
                .xp(1500)
                .level(2)
                .rating(1400)
                .battlesWon(5)
                .battlesLost(3)
                .totalProblemsSolved(10)
                .build();

        when(profileRepository.findById(userId)).thenReturn(Optional.of(profile));
        when(profileRepository.findRankByUserId(userId)).thenReturn(42);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(userId, response.getUserId());
        assertEquals(1500, response.getXp());
        assertEquals(1400, response.getRating());
        assertEquals(42, response.getRank());

        verify(profileRepository, times(1)).findById(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
    }

    @Test
    public void testCalculateRankWhenRankIsNull() {
        UUID userId = UUID.randomUUID();
        UserArenaProfile profile = UserArenaProfile.builder()
                .userId(userId)
                .xp(0)
                .level(1)
                .rating(1200)
                .build();

        when(profileRepository.findById(userId)).thenReturn(Optional.of(profile));
        // Simulate no rank found
        when(profileRepository.findRankByUserId(userId)).thenReturn(null);
        
        // Mock findTopPlayers to return empty list (size = 0)
        when(profileRepository.findTopPlayers(any())).thenReturn(java.util.Collections.emptyList());

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(1, response.getRank()); // size + 1 = 0 + 1 = 1

        verify(profileRepository, times(1)).findRankByUserId(userId);
        verify(profileRepository, times(1)).findTopPlayers(any());
    }
}
