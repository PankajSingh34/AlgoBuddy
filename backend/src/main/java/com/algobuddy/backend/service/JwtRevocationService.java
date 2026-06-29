package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.RevokedJwtToken;
import com.algobuddy.backend.repository.RevokedJwtTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtRevocationService {

    private final RevokedJwtTokenRepository revokedJwtTokenRepository;

    @Transactional
    public void revokeToken(UUID userId, String rawToken, Instant expiresAt) {
        if (userId == null || rawToken == null || rawToken.isBlank()) {
            return;
        }

        revokedJwtTokenRepository.findByTokenHash(hashToken(rawToken)).ifPresentOrElse(
                existing -> {
                    existing.setUserId(userId);
                    existing.setExpiresAt(resolveExpiry(expiresAt));
                    existing.setRevokedAt(OffsetDateTime.now(ZoneOffset.UTC));
                    revokedJwtTokenRepository.save(existing);
                },
                () -> revokedJwtTokenRepository.save(new RevokedJwtToken(
                        UUID.randomUUID(),
                        userId,
                        hashToken(rawToken),
                        resolveExpiry(expiresAt),
                        OffsetDateTime.now(ZoneOffset.UTC)
                ))
        );
    }

    public boolean isTokenRevoked(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return false;
        }

        return revokedJwtTokenRepository.existsByTokenHashAndExpiresAtAfter(
                hashToken(rawToken),
                OffsetDateTime.now(ZoneOffset.UTC)
        );
    }

    static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash JWT for revocation", ex);
        }
    }

    private static OffsetDateTime resolveExpiry(Instant expiresAt) {
        Instant safeExpiry = expiresAt != null ? expiresAt : Instant.now().plusSeconds(3600);
        return OffsetDateTime.ofInstant(safeExpiry, ZoneOffset.UTC);
    }
}
