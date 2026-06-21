package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.Bookmark;
import com.algobuddy.backend.repository.BookmarkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookmarkServiceTest {

    private BookmarkRepository bookmarkRepository;
    private BookmarkService bookmarkService;

    @BeforeEach
    public void setUp() {
        bookmarkRepository = mock(BookmarkRepository.class);
        bookmarkService = new BookmarkService(bookmarkRepository);
    }

    // ── getBookmarks(UUID, Pageable) ───────────────────────────────
    @Test
    public void testGetBookmarksWithPageableReturnsPageFromRepository() {
        UUID userId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);
        Bookmark bookmark = new Bookmark();
        bookmark.setId(UUID.randomUUID());
        bookmark.setUserId(userId);
        bookmark.setProblemId("two-sum");
        bookmark.setTopicSlug("arrays");

        Page<Bookmark> expectedPage = new PageImpl<>(List.of(bookmark));
        when(bookmarkRepository.findByUserId(userId, pageable)).thenReturn(expectedPage);

        Page<Bookmark> result = bookmarkService.getBookmarks(userId, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("two-sum", result.getContent().get(0).getProblemId());
        verify(bookmarkRepository, times(1)).findByUserId(userId, pageable);
    }

    @Test
    public void testGetBookmarksWithPageableReturnsEmptyPageWhenNoBookmarks() {
        UUID userId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Bookmark> emptyPage = Page.empty(pageable);
        when(bookmarkRepository.findByUserId(userId, pageable)).thenReturn(emptyPage);

        Page<Bookmark> result = bookmarkService.getBookmarks(userId, pageable);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
    }

    // ── getBookmarks(UUID) ───────────────────────────────────────────
    @Test
    public void testGetBookmarksReturnsListFromRepository() {
        UUID userId = UUID.randomUUID();
        Bookmark bookmark = new Bookmark();
        bookmark.setId(UUID.randomUUID());
        bookmark.setUserId(userId);
        bookmark.setProblemId("linked-list-cycle");
        bookmark.setTopicSlug("linked-lists");

        when(bookmarkRepository.findByUserId(userId)).thenReturn(List.of(bookmark));

        List<Bookmark> result = bookmarkService.getBookmarks(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("linked-list-cycle", result.get(0).getProblemId());
        verify(bookmarkRepository, times(1)).findByUserId(userId);
    }

    @Test
    public void testGetBookmarksReturnsEmptyListWhenNoBookmarks() {
        UUID userId = UUID.randomUUID();
        when(bookmarkRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        List<Bookmark> result = bookmarkService.getBookmarks(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ── addBookmark ─────────────────────────────────────────────────
    @Test
    public void testAddBookmarkInsertsNewBookmarkWhenNotAlreadyPresent() {
        UUID userId = UUID.randomUUID();
        String problemId = "binary-search";
        String topicSlug = "search";

        when(bookmarkRepository.findByUserIdAndProblemId(userId, problemId))
                .thenReturn(Optional.empty());
        when(bookmarkRepository.save(any(Bookmark.class))).thenAnswer(inv -> inv.getArgument(0));

        bookmarkService.addBookmark(userId, problemId, topicSlug);

        verify(bookmarkRepository, times(1)).findByUserIdAndProblemId(userId, problemId);
        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
    }

    @Test
    public void testAddBookmarkSetsCorrectFieldsOnNewBookmark() {
        UUID userId = UUID.randomUUID();
        String problemId = "merge-intervals";
        String topicSlug = "sorting";

        when(bookmarkRepository.findByUserIdAndProblemId(userId, problemId))
                .thenReturn(Optional.empty());
        when(bookmarkRepository.save(any(Bookmark.class))).thenAnswer(inv -> {
            Bookmark saved = inv.getArgument(0);
            assertEquals(userId, saved.getUserId());
            assertEquals(problemId, saved.getProblemId());
            assertEquals(topicSlug, saved.getTopicSlug());
            return saved;
        });

        bookmarkService.addBookmark(userId, problemId, topicSlug);

        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
    }

    @Test
    public void testAddBookmarkIsIdempotentWhenBookmarkAlreadyExists() {
        UUID userId = UUID.randomUUID();
        String problemId = "valid-parentheses";
        String topicSlug = "stacks";

        Bookmark existing = new Bookmark();
        existing.setId(UUID.randomUUID());
        existing.setUserId(userId);
        existing.setProblemId(problemId);
        existing.setTopicSlug(topicSlug);

        when(bookmarkRepository.findByUserIdAndProblemId(userId, problemId))
                .thenReturn(Optional.of(existing));

        bookmarkService.addBookmark(userId, problemId, topicSlug);

        verify(bookmarkRepository, times(1)).findByUserIdAndProblemId(userId, problemId);
        verify(bookmarkRepository, never()).save(any(Bookmark.class));
    }

    // ── removeBookmark ──────────────────────────────────────────────
    @Test
    public void testRemoveBookmarkDeletesBookmarkWhenExists() {
        UUID userId = UUID.randomUUID();
        String problemId = "max-depth";

        Bookmark existing = new Bookmark();
        existing.setId(UUID.randomUUID());
        existing.setUserId(userId);
        existing.setProblemId(problemId);

        when(bookmarkRepository.findByUserIdAndProblemId(userId, problemId))
                .thenReturn(Optional.of(existing));

        bookmarkService.removeBookmark(userId, problemId);

        verify(bookmarkRepository, times(1)).findByUserIdAndProblemId(userId, problemId);
        verify(bookmarkRepository, times(1)).delete(existing);
    }

    @Test
    public void testRemoveBookmarkIsNoOpWhenBookmarkDoesNotExist() {
        UUID userId = UUID.randomUUID();
        String problemId = "nonexistent-problem";

        when(bookmarkRepository.findByUserIdAndProblemId(userId, problemId))
                .thenReturn(Optional.empty());

        bookmarkService.removeBookmark(userId, problemId);

        verify(bookmarkRepository, times(1)).findByUserIdAndProblemId(userId, problemId);
        verify(bookmarkRepository, never()).delete(any(Bookmark.class));
    }
}
