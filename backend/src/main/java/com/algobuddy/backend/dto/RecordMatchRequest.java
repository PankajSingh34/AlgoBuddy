package com.algobuddy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordMatchRequest {

    @NotBlank(message = "Match ID is required to prevent duplicates")
    private String matchId;
    private String topic;
    private String difficulty;
    private boolean isWinner;
}
