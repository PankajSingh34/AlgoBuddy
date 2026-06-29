package com.algobuddy.backend.config.filter;

import com.algobuddy.backend.service.JwtRevocationService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtRevocationFilterTest {

    @Mock
    private JwtRevocationService jwtRevocationService;

    @Mock
    private FilterChain filterChain;

    @Test
    void revokedTokenShortCircuitsTheRequest() throws Exception {
        when(jwtRevocationService.isTokenRevoked("revoked-token")).thenReturn(true);

        JwtRevocationFilter filter = new JwtRevocationFilter(jwtRevocationService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer revoked-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        org.junit.jupiter.api.Assertions.assertEquals(401, response.getStatus());
    }
}
