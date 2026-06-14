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
public class RecordMatchRequest {
    private UUID opponentId;
    private String matchId;
    private String topic;
    private String difficulty;
    private boolean isWinner;
}
