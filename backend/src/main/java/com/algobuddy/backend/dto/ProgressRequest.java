package com.algobuddy.backend.dto;

import lombok.Data;

@Data
public class ProgressRequest {
    private String problemId;
    private String status;
}
