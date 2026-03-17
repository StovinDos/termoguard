package com.termoguard.service;

import com.termoguard.dto.AuthDto.*;
import com.termoguard.model.User;
import com.termoguard.repository.UserRepository;
import com.termoguard.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service.
 *
 * Handles:
 *   - New user registration (with duplicate email check + BCrypt hashing)
 *   - User login via Spring Security's AuthenticationManager
 *   - JWT token issuance
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider      tokenProvider;

    // ── Register ──────────────────────────────────────────────────────────

    /**
     * Registers a new user.
     *
     * @throws IllegalArgumentException if the email is already taken
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // 1. Guard: reject duplicate emails
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException(
                "An account with email '" + request.getEmail() + "' already exists.");
        }

        // 2. Hash the raw password with BCrypt (strength 12, from SecurityConfig)
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // 3. Persist new user
        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail().toLowerCase())
            .passwordHash(passwordHash)
            .role(User.Role.CUSTOMER)
            .build();

        user = userRepository.save(user);
        log.info("New user registered: id={} email={}", user.getId(), user.getEmail());

        // 4. Issue JWT immediately (auto-login on register)
        String token = tokenProvider.generateToken(
            user.getEmail(), user.getId(), user.getRole().name());

        return AuthResponse.builder()
            .token(token)
            .user(UserDto.from(user))
            .build();
    }

    // ── Login ─────────────────────────────────────────────────────────────

    /**
     * Authenticates an existing user.
     *
     * @throws BadCredentialsException  if email/password are incorrect
     * @throws DisabledException        if the account is locked/disabled
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        // Delegate credential verification to Spring Security's AuthenticationManager
        // (which calls CustomUserDetailsService + BCryptPasswordEncoder internally)
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail().toLowerCase(),
                    request.getPassword()
                )
            );
        } catch (AuthenticationException ex) {
            // Translate to a user-facing message (don't leak "user not found" vs "wrong password")
            throw new BadCredentialsException("Invalid email or password");
        }

        // Reload full User entity to include id and role in the JWT
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        String token = tokenProvider.generateToken(
            user.getEmail(), user.getId(), user.getRole().name());

        log.info("User logged in: id={} email={}", user.getId(), user.getEmail());

        return AuthResponse.builder()
            .token(token)
            .user(UserDto.from(user))
            .build();
    }

    // ── Get Profile ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        return UserDto.from(user);
    }

    // ── Update Profile ────────────────────────────────────────────────────

    /**
     * Updates a user's first name, last name, and email address.
     *
     * @throws IllegalArgumentException if the new email is already taken by another account
     */
    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalStateException("User not found: " + email));

        // Guard: reject new email if already taken by a *different* account
        String newEmail = request.getEmail().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(newEmail) &&
                userRepository.existsByEmailIgnoreCase(newEmail)) {
            throw new IllegalArgumentException(
                "An account with email '" + request.getEmail() + "' already exists.");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(newEmail);

        user = userRepository.save(user);
        log.info("Profile updated: id={} email={}", user.getId(), user.getEmail());

        return UserDto.from(user);
    }

    // ── Change Password ───────────────────────────────────────────────────

    /**
     * Changes a user's password after verifying the current one.
     *
     * @throws BadCredentialsException if currentPassword does not match the stored hash
     */
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalStateException("User not found: " + email));

        // Verify that the supplied current password matches the stored BCrypt hash
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Hash the new password and persist
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed: id={} email={}", user.getId(), user.getEmail());
    }
}
