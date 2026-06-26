package com.algobuddy.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SRSReviewRequest {
    @NotBlank
    private String algorithmId;

    @Min(0)
    @Max(5)
    private int quality;
}
