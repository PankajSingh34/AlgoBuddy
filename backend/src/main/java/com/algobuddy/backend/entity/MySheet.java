package com.algobuddy.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "my_sheet", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "problem_id"})})
@Data
@NoArgsConstructor
public class MySheet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "problem_id", nullable = false)
    private String problemId;

    @Column(name = "note")
    private String note;

    @Column(name = "added_at", insertable = false, updatable = false)
    private OffsetDateTime addedAt;

    @Column(name = "is_public")
    private Boolean isPublic = false;
}
