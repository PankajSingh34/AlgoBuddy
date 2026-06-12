package com.algobuddy.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ProgressRequest {
    @NotBlank(message = "problemId is required")
    private String problemId;
    @NotBlank(message = "status is required")
    private String status;
}
