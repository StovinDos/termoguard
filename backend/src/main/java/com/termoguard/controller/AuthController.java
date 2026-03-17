package com.termoguard.controller;

import com.termoguard.dto.AuthDto.*;
import com.termoguard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication.
 *
 * All routes under /api/auth/** are PUBLIC (see SecurityConfig).
 * /api/auth/me requires a valid JWT.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // ── POST /api/auth/register ───────────────────────────────────────────

    /**
     * Register a new user account.
     *
     * Request body:  {@link RegisterRequest}
     * Response body: {@link AuthResponse} (includes JWT + user profile)
     * Status:        201 Created on success
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Register attempt for email={}", request.getEmail());
        try {
            AuthResponse response = authService.register(request);
            log.info("Register succeeded for email={}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            log.warn("Register rejected for email={} — {}", request.getEmail(), ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Register failed for email={}", request.getEmail(), ex);
            throw ex;
        }
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────

    /**
     * Authenticate an existing user.
     *
     * Request body:  {@link LoginRequest}
     * Response body: {@link AuthResponse} (includes JWT + user profile)
     * Status:        200 OK on success
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login attempt for email={}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            log.info("Login succeeded for email={}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("Login failed for email={}", request.getEmail(), ex);
            throw ex;
        }
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────

    /**
     * Return the currently authenticated user's profile.
     * Requires a valid Bearer token in the Authorization header.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> me(
        @AuthenticationPrincipal UserDetails principal
    ) {
        UserDto profile = authService.getProfile(principal.getUsername());
        return ResponseEntity.ok(profile);
    }
}
