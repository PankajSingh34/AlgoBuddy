package com.algobuddy.backend.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.lang.NonNull;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    @Value("${app.trusted-proxies:127.0.0.1,::1,10.0.0.1}")
    private String trustedProxiesConfig;

    private Set<String> trustedProxies;

    private final Cache<String, Bucket> cache;

    public RateLimitInterceptor() {
        this.cache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(10_000)
                .build();
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(100)
                .refillGreedy(100, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket resolveBucket(String key) {
        return cache.get(key, k -> newBucket());
    }

    private Set<String> getTrustedProxies() {
        if (trustedProxies == null) {
            trustedProxies = Arrays.stream(trustedProxiesConfig.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());
        }
        return trustedProxies;
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && isFromTrustedProxy(request)) {
            String[] hops = xForwardedFor.split(",");
            for (int i = hops.length - 1; i >= 0; i--) {
                String ip = hops[i].trim();
                if (isValidIp(ip) && !isPrivateIp(ip)) {
                    return ip;
                }
            }
        }
        return request.getRemoteAddr();
    }

    private boolean isFromTrustedProxy(HttpServletRequest request) {
        return getTrustedProxies().contains(request.getRemoteAddr());
    }

    private boolean isPrivateIp(String ip) {
        if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("127.") || ip.equals("::1") || ip.startsWith("fc") || ip.startsWith("fd")) {
            return true;
        }
        if (ip.startsWith("172.")) {
            try {
                String[] parts = ip.split("\\.");
                if (parts.length >= 2) {
                    int secondOctet = Integer.parseInt(parts[1]);
                    return secondOctet >= 16 && secondOctet <= 31;
                }
            } catch (Exception e) {}
        }
        return false;
    }

    private boolean isValidIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }
        try {
            // InetAddress.getByName accepts both IPv4 and IPv6 literals.
            // Round-tripping through getHostAddress() rejects hostnames:
            // a hostname would resolve to a different address string.
            InetAddress addr = InetAddress.getByName(ip);
            return addr.getHostAddress().equalsIgnoreCase(ip)
                    || normalizeIpv6(addr.getHostAddress()).equalsIgnoreCase(normalizeIpv6(ip));
        } catch (UnknownHostException e) {
            return false;
        }
    }

    /**
     * Strip the zone-ID suffix (e.g. "%eth0") from an IPv6 address string
     * before comparing, so that scoped addresses compare equal to their
     * plain counterparts.
     */
    private static String normalizeIpv6(String ip) {
        int zoneIndex = ip.indexOf('%');
        return zoneIndex >= 0 ? ip.substring(0, zoneIndex) : ip;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        String ip = extractClientIp(request);

        Bucket bucket = resolveBucket(ip);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            return false;
        }
    }
}
