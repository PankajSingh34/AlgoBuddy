package com.algobuddy.backend.controller;

import com.algobuddy.backend.service.JwtRevocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication utilities")
public class AuthController {

    private final JwtRevocationService jwtRevocationService;

    @PostMapping("/logout")
    @Operation(summary = "Logout current session", description = "Revokes the current access token so it can no longer be used.")
    public ResponseEntity<Map<String, String>> logout(@AuthenticationPrincipal Jwt jwt,
                                                      @org.springframework.web.bind.annotation.RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        jwtRevocationService.revokeToken(
                jwt.getSubject() != null ? java.util.UUID.fromString(jwt.getSubject()) : null,
                extractBearerToken(authorization),
                jwt.getExpiresAt()
        );

        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    private static String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null) {
            return null;
        }

        String prefix = "Bearer ";
        if (!authorizationHeader.startsWith(prefix)) {
            return null;
        }

        String token = authorizationHeader.substring(prefix.length()).trim();
        return token.isEmpty() ? null : token;
    }
}
