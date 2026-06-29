package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.RevokedJwtToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RevokedJwtTokenRepository extends JpaRepository<RevokedJwtToken, UUID> {

    Optional<RevokedJwtToken> findByTokenHash(String tokenHash);

    boolean existsByTokenHashAndExpiresAtAfter(String tokenHash, OffsetDateTime now);
}
