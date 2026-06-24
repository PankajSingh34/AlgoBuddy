package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitMatchRequest {
    private String matchId;
    private UUID opponentId;
    private String topic;
    private String difficulty;
}
