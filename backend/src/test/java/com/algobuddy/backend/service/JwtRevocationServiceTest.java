package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.RevokedJwtToken;
import com.algobuddy.backend.repository.RevokedJwtTokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtRevocationServiceTest {

    @Mock
    private RevokedJwtTokenRepository revokedJwtTokenRepository;

    @InjectMocks
    private JwtRevocationService jwtRevocationService;

    @Test
    void revokeTokenHashesAndPersistsTheToken() {
        when(revokedJwtTokenRepository.findByTokenHash(anyString()))
                .thenReturn(java.util.Optional.empty());
        when(revokedJwtTokenRepository.save(any(RevokedJwtToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UUID userId = UUID.randomUUID();
        jwtRevocationService.revokeToken(userId, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", Instant.now().plusSeconds(900));

        ArgumentCaptor<RevokedJwtToken> captor = ArgumentCaptor.forClass(RevokedJwtToken.class);
        verify(revokedJwtTokenRepository).save(captor.capture());
        assertEquals(userId, captor.getValue().getUserId());
        assertEquals(64, captor.getValue().getTokenHash().length());
    }

    @Test
    void isTokenRevokedReturnsRepositoryResult() {
        when(revokedJwtTokenRepository.existsByTokenHashAndExpiresAtAfter(anyString(), any()))
                .thenReturn(true);

        assertTrue(jwtRevocationService.isTokenRevoked("token-value"));
    }

    @Test
    void isTokenRevokedReturnsFalseForMissingToken() {
        assertFalse(jwtRevocationService.isTokenRevoked(null));
    }
}
