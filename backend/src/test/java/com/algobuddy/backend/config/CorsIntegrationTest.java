package com.algobuddy.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
    classes = SecurityConfig.class,
    properties = {
        "app.allowed-origins=http://localhost:3000,https://algobuddy.me",
        "app.environment=test"
    }
)
@AutoConfigureMockMvc
public class CorsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testAllowedOriginPreflight() throws Exception {
        mockMvc.perform(options("/api/v1/practice/progress")
                .header(HttpHeaders.ORIGIN, "https://algobuddy.me")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://algobuddy.me"));
    }

    @Test
    public void testBlockedOriginPreflight() throws Exception {
        mockMvc.perform(options("/api/v1/practice/progress")
                .header(HttpHeaders.ORIGIN, "http://evil.com")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden());
    }
}
