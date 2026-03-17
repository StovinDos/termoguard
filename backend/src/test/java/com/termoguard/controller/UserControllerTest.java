package com.termoguard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.termoguard.config.SecurityConfig;
import com.termoguard.dto.AuthDto.*;
import com.termoguard.model.User;
import com.termoguard.security.JwtTokenProvider;
import com.termoguard.service.AuthService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired MockMvc            mvc;
    @Autowired ObjectMapper       mapper;
    @MockBean  AuthService        authService;
    @MockBean  JwtTokenProvider   jwtTokenProvider;
    @MockBean  UserDetailsService userDetailsService;

    private final UserDto mockUser = UserDto.builder()
        .id(1L).firstName("Janet").lastName("Smith")
        .email("janet@example.com").role(User.Role.CUSTOMER).build();

    // ── PUT /api/users/profile ────────────────────────────────────────────

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/profile — 200 on valid payload")
    void updateProfile_returns200() throws Exception {
        when(authService.updateProfile(eq("jane@example.com"), any()))
            .thenReturn(mockUser);

        var body = new UpdateProfileRequest("Janet", "Smith", "janet@example.com");

        mvc.perform(put("/api/users/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Janet"))
            .andExpect(jsonPath("$.email").value("janet@example.com"));
    }

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/profile — 400 on missing fields")
    void updateProfile_returns400_onMissingFields() throws Exception {
        mvc.perform(put("/api/users/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/profile — 400 when email already taken")
    void updateProfile_returns400_onDuplicateEmail() throws Exception {
        when(authService.updateProfile(eq("jane@example.com"), any()))
            .thenThrow(new IllegalArgumentException("already exists"));

        var body = new UpdateProfileRequest("Jane", "Doe", "other@example.com");

        mvc.perform(put("/api/users/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("already exists"));
    }

    // ── PUT /api/users/password ───────────────────────────────────────────

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/password — 204 on correct current password")
    void changePassword_returns204() throws Exception {
        doNothing().when(authService).changePassword(eq("jane@example.com"), any());

        var body = new ChangePasswordRequest("oldPass1", "newPass123");

        mvc.perform(put("/api/users/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/password — 401 on wrong current password")
    void changePassword_returns401_onWrongCurrent() throws Exception {
        doThrow(new BadCredentialsException("Current password is incorrect"))
            .when(authService).changePassword(eq("jane@example.com"), any());

        var body = new ChangePasswordRequest("wrongPass", "newPass123");

        mvc.perform(put("/api/users/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Current password is incorrect"));
    }

    @Test
    @WithMockUser(username = "jane@example.com")
    @DisplayName("PUT /api/users/password — 400 on short new password")
    void changePassword_returns400_onShortPassword() throws Exception {
        var body = new ChangePasswordRequest("oldPass1", "short");

        mvc.perform(put("/api/users/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }
}
