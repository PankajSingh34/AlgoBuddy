package com.algobuddy.backend;

import com.algobuddy.backend.repository.BookmarkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.UUID;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private BookmarkRepository bookmarkRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void testQueryBookmarks() {
		try {
			bookmarkRepository.findByUserId(UUID.randomUUID());
			System.out.println("Query bookmarks succeeded!");
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}

