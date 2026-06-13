package com.algobuddy.backend.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class BulkProgressRequest {

    @Valid
    @NotEmpty(message = "items cannot be empty")
    private List<Item> items;

    @Data
    public static class Item {
        @NotBlank(message = "problemId is required")
        private String problemId;
        
        @NotBlank(message = "status is required")
        private String status;
    }
}
