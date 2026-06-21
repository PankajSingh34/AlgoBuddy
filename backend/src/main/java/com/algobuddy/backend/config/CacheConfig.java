package com.algobuddy.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the Spring Cache abstraction with an in-process
 * {@link ConcurrentMapCacheManager}. This keeps the application
 * self-contained (no Redis/Caffeine dependency) while satisfying the
 * {@code @EnableCaching} requirement declared on {@link com.algobuddy.backend.BackendApplication}.
 *
 * <p>Named caches registered here must match the {@code value} attributes
 * used in {@code @Cacheable}, {@code @CacheEvict}, and {@code @Caching}
 * annotations across the service layer.
 */
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                "arenaProfile",
                "arenaLeaderboard",
                "mysheet",
                "bookmarks"
        );
    }
}
