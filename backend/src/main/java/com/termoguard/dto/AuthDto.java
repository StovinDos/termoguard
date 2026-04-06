package com.termoguard.dto;

import com.termoguard.model.User;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * All Data Transfer Objects for authentication endpoints.
 * Using nested static classes keeps related DTOs together.
 */
public class AuthDto {

    // ── Register Request ────────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {

        @NotBlank(message = "First name is required")
        @Size(max = 80)
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(max = 80)
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        @Size(max = 255)
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 128, message = "Password must be 8–128 characters")
        private String password;
    }

    // ── Login Request ────────────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    // ── Auth Response (returned on both login & register) ────────────────

    @Getter
    @Builder
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private UserDto user;
    }

    // ── User DTO (safe to return — no password hash) ─────────────────────

    @Getter
    @Builder
    @AllArgsConstructor
    public static class UserDto {
        private Long      id;
        private String    firstName;
        private String    lastName;
        private String    email;
        private User.Role role;
        private java.time.Instant createdAt;

        /** Map entity → DTO */
        public static UserDto from(User user) {
            return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
        }
    }

    // ── Update Profile Request ────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {

        @NotBlank(message = "First name is required")
        @Size(max = 80)
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(max = 80)
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        @Size(max = 255)
        private String email;
    }

    // ── Change Password Request ───────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {

        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 128, message = "New password must be 8–128 characters")
        private String newPassword;
    }

    // ── Generic error response ────────────────────────────────────────────

    @Getter
    @AllArgsConstructor
    public static class ErrorResponse {
        private String message;
        private int    status;
    }
}
