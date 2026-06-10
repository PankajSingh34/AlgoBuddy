package com.algobuddy.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkProgressRequest {

    private List<Item> items;

    @Data
    public static class Item {
        private String problemId;
        private String status;
    }
}
