package com.termoguard.controller;

import com.termoguard.dto.AuthDto.*;
import com.termoguard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user profile and password management.
 *
 * All routes under /api/users/** require a valid JWT (see SecurityConfig).
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // ── PUT /api/users/profile ────────────────────────────────────────────

    /**
     * Update the authenticated user's first name, last name, and email.
     *
     * Request body:  {@link UpdateProfileRequest}
     * Response body: {@link UserDto} (updated profile, no password hash)
     * Status:        200 OK on success
     */
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
        @AuthenticationPrincipal UserDetails principal,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserDto updated = authService.updateProfile(principal.getUsername(), request);
        return ResponseEntity.ok(updated);
    }

    // ── PUT /api/users/password ───────────────────────────────────────────

    /**
     * Change the authenticated user's password.
     * Requires the current password for verification.
     *
     * Request body:  {@link ChangePasswordRequest}
     * Status:        204 No Content on success
     */
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal UserDetails principal,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(principal.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}
