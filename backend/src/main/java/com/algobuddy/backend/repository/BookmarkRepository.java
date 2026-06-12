package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    List<Bookmark> findByUserId(UUID userId);
    Optional<Bookmark> findByUserIdAndProblemId(UUID userId, String problemId);
}
