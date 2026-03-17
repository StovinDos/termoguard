package com.termoguard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.termoguard.dto.AuthDto.*;
import com.termoguard.service.AuthService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired MockMvc       mvc;
    @Autowired ObjectMapper  mapper;
    @MockBean  AuthService   authService;

    private final UserDto mockUser = UserDto.builder()
        .id(1L).firstName("Jane").lastName("Doe")
        .email("jane@example.com").build();

    // ── POST /api/auth/register ───────────────────────────────────────────

    @Test
    @DisplayName("POST /api/auth/register — 201 on valid payload")
    void register_returns201() throws Exception {
        when(authService.register(any())).thenReturn(
            AuthResponse.builder().token("jwt.token").user(mockUser).build()
        );

        var body = new RegisterRequest("Jane", "Doe", "jane@example.com", "password123");

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").value("jwt.token"))
            .andExpect(jsonPath("$.user.email").value("jane@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/register — 400 on missing fields")
    void register_returns400_onMissingFields() throws Exception {
        // Send empty object — all required fields absent
        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register — 400 on short password")
    void register_returns400_onShortPassword() throws Exception {
        var body = new RegisterRequest("Jane", "Doe", "jane@example.com", "short");

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/auth/login — 200 on valid credentials")
    void login_returns200() throws Exception {
        when(authService.login(any())).thenReturn(
            AuthResponse.builder().token("jwt.token").user(mockUser).build()
        );

        var body = new LoginRequest("jane@example.com", "password123");

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/auth/login — 401 on bad credentials")
    void login_returns401_onBadCredentials() throws Exception {
        when(authService.login(any())).thenThrow(new BadCredentialsException("Invalid email or password"));

        var body = new LoginRequest("jane@example.com", "wrongpass");

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
