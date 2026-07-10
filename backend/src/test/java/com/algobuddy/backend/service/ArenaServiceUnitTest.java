package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaLeaderboardProjection;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import org.springframework.transaction.PlatformTransactionManager;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class ArenaServiceUnitTest {

    private UserArenaProfileRepository profileRepository;
    private ArenaMatchRepository matchRepository;
    private CacheManager cacheManager;
    private PlatformTransactionManager transactionManager;
    private Cache cache;
    private ArenaService arenaService;

    @BeforeEach
    public void setUp() {
        profileRepository = mock(UserArenaProfileRepository.class);
        matchRepository = mock(ArenaMatchRepository.class);
        cacheManager = mock(CacheManager.class);
        transactionManager = mock(PlatformTransactionManager.class);
        cache = mock(Cache.class);
        when(cacheManager.getCache(anyString())).thenReturn(cache);
        arenaService = new ArenaService(profileRepository, matchRepository, cacheManager, transactionManager);
    }

    @Test
    public void testGetProfileReturnsCorrectRank() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(1500);
        when(projection.getLevel()).thenReturn(2);
        when(projection.getRating()).thenReturn(1400);
        when(projection.getBattlesWon()).thenReturn(5);
        when(projection.getBattlesLost()).thenReturn(3);
        when(projection.getTotalProblemsSolved()).thenReturn(10);
        when(projection.getName()).thenReturn("TestUser");
        when(projection.getAvatarUrl()).thenReturn("http://avatar.url");

        when(profileRepository.existsById(userId)).thenReturn(true);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        when(profileRepository.findRankByUserId(userId)).thenReturn(42);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(userId, response.getUserId());
        assertEquals(1500, response.getXp());
        assertEquals(1400, response.getRating());
        assertEquals(42, response.getRank());
        assertEquals("TestUser", response.getName());
        assertEquals("http://avatar.url", response.getAvatarUrl());

        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
    }

    @Test
    public void testCalculateRankWhenRankIsNull() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(0);
        when(projection.getLevel()).thenReturn(1);
        when(projection.getRating()).thenReturn(1200);
        when(projection.getBattlesWon()).thenReturn(0);
        when(projection.getBattlesLost()).thenReturn(0);
        when(projection.getTotalProblemsSolved()).thenReturn(0);
        when(projection.getName()).thenReturn("NewUser");
        when(projection.getAvatarUrl()).thenReturn("");

        when(profileRepository.existsById(userId)).thenReturn(true);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        
        // Simulate no rank found
        when(profileRepository.findRankByUserId(userId)).thenReturn(null);
        
        // Mock findTopPlayers to return empty list (size = 0)
        when(profileRepository.findTopPlayers(any())).thenReturn(java.util.Collections.emptyList());

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(1, response.getRank()); // size + 1 = 0 + 1 = 1

        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
        verify(profileRepository, times(1)).findTopPlayers(any());
    }

    @Test
    public void testGetProfileCreatesDefaultProfileIfNotFound() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(0);
        when(projection.getLevel()).thenReturn(1);
        when(projection.getRating()).thenReturn(1200);

        when(profileRepository.existsById(userId)).thenReturn(false);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        when(profileRepository.findRankByUserId(userId)).thenReturn(1);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).save(any(UserArenaProfile.class));
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
    }

    @Test
    public void testGetMatchHistoryResolvesNPlus1() {
        UUID userId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        
        com.algobuddy.backend.entity.ArenaMatch match1 = com.algobuddy.backend.entity.ArenaMatch.builder()
                .id(UUID.randomUUID())
                .matchId("match-1")
                .player1Id(userId)
                .player2Id(opponentId)
                .topic("Arrays")
                .difficulty("Easy")
                .startTime(java.time.LocalDateTime.now())
                .status(com.algobuddy.backend.entity.ArenaMatch.MatchStatus.COMPLETED)
                .winnerId(userId)
                .build();

        when(matchRepository.findRecentMatchesByUserId(eq(userId), any())).thenReturn(java.util.List.of(match1));
        
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(opponentId);
        when(projection.getName()).thenReturn("OpponentUser");
        
        when(profileRepository.findProfilesWithUserDetailsIn(any())).thenReturn(java.util.List.of(projection));

        java.util.List<com.algobuddy.backend.dto.ArenaMatchResponse> history = arenaService.getMatchHistory(userId);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals("OpponentUser", history.get(0).getOpponentName());
        assertEquals("Victory", history.get(0).getResult());

        verify(matchRepository, times(1)).findRecentMatchesByUserId(eq(userId), any());
        verify(profileRepository, times(1)).findProfilesWithUserDetailsIn(any());
        verify(profileRepository, never()).findProfileWithUserDetails(any());
    }
}

