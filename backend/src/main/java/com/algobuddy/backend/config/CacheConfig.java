package com.algobuddy.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.time.Duration;

/**
 * Configures the Spring Cache abstraction with a Redis-backed
 * {@link RedisCacheManager}. This replaces the previous in-process
 * {@code ConcurrentMapCacheManager} to ensure cache entries are
 * shared across all application instances in multi-instance deployments.
 *
 * <p>Named caches registered here must match the {@code value} attributes
 * used in {@code @Cacheable}, {@code @CacheEvict}, and {@code @Caching}
 * annotations across the service layer.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @ConditionalOnProperty(name = "app.cache.redis.enabled", havingValue = "true")
    public CacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .disableCachingNullValues();

        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(defaults)
            .withCacheConfiguration("arenaProfile",
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10)))
            .withCacheConfiguration("arenaLeaderboard",
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(5)))
            .withCacheConfiguration("mysheet",
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(30)))
            .withCacheConfiguration("bookmarks",
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(60)))
            .build();
    }

    @Bean
    @ConditionalOnProperty(name = "app.cache.redis.enabled", havingValue = "false", matchIfMissing = true)
    public CacheManager simpleCacheManager() {
        return new org.springframework.cache.concurrent.ConcurrentMapCacheManager(
            "arenaProfile", "arenaLeaderboard", "mysheet", "bookmarks"
        );
    }
}
