package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitMatchRequest {
    @NotBlank(message = "matchId is required")
    private String matchId;

    private String topic;
    private String difficulty;
}
