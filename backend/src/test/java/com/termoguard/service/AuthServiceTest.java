package com.termoguard.service;

import com.termoguard.dto.AuthDto.*;
import com.termoguard.model.User;
import com.termoguard.repository.UserRepository;
import com.termoguard.security.JwtTokenProvider;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository        userRepository;
    @Mock PasswordEncoder       passwordEncoder;
    @Mock AuthenticationManager authManager;
    @Mock JwtTokenProvider      tokenProvider;

    @InjectMocks AuthService authService;

    // ── Register ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("register() — happy path creates user and returns JWT")
    void register_success() {
        // Arrange
        RegisterRequest req = new RegisterRequest("Jane", "Doe", "jane@example.com", "password123");

        when(userRepository.existsByEmailIgnoreCase("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2b$12$hashed");

        User savedUser = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateToken("jane@example.com", 1L, "CUSTOMER")).thenReturn("jwt.token.here");

        // Act
        AuthResponse response = authService.register(req);

        // Assert
        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        assertThat(response.getUser().getEmail()).isEqualTo("jane@example.com");
        assertThat(response.getUser().getFirstName()).isEqualTo("Jane");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register() — throws on duplicate email")
    void register_duplicateEmail_throws() {
        RegisterRequest req = new RegisterRequest("Jane", "Doe", "jane@example.com", "password123");
        when(userRepository.existsByEmailIgnoreCase("jane@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    // ── Login ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login() — valid credentials return JWT")
    void login_success() {
        LoginRequest req = new LoginRequest("jane@example.com", "password123");

        User user = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();

        when(userRepository.findByEmailIgnoreCase("jane@example.com")).thenReturn(Optional.of(user));
        when(tokenProvider.generateToken("jane@example.com", 1L, "CUSTOMER")).thenReturn("jwt.token.here");

        AuthResponse response = authService.login(req);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getUser().getEmail()).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("login() — bad credentials throw BadCredentialsException")
    void login_badCredentials_throws() {
        LoginRequest req = new LoginRequest("jane@example.com", "wrongpass");

        doThrow(new BadCredentialsException("Bad credentials"))
            .when(authManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(req))
            .isInstanceOf(BadCredentialsException.class);
    }

    // ── Update Profile ────────────────────────────────────────────────────

    @Test
    @DisplayName("updateProfile() — happy path updates and returns UserDto")
    void updateProfile_success() {
        User existing = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();

        UpdateProfileRequest req = new UpdateProfileRequest("Janet", "Smith", "janet@example.com");

        when(userRepository.findByEmailIgnoreCase("jane@example.com"))
            .thenReturn(Optional.of(existing));
        when(userRepository.existsByEmailIgnoreCase("janet@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserDto result = authService.updateProfile("jane@example.com", req);

        assertThat(result.getFirstName()).isEqualTo("Janet");
        assertThat(result.getLastName()).isEqualTo("Smith");
        assertThat(result.getEmail()).isEqualTo("janet@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("updateProfile() — throws when new email is taken by another account")
    void updateProfile_duplicateEmail_throws() {
        User existing = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();

        UpdateProfileRequest req = new UpdateProfileRequest("Jane", "Doe", "other@example.com");

        when(userRepository.findByEmailIgnoreCase("jane@example.com"))
            .thenReturn(Optional.of(existing));
        when(userRepository.existsByEmailIgnoreCase("other@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.updateProfile("jane@example.com", req))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    // ── Change Password ───────────────────────────────────────────────────

    @Test
    @DisplayName("changePassword() — happy path saves new hashed password")
    void changePassword_success() {
        User existing = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();

        ChangePasswordRequest req = new ChangePasswordRequest("oldPass", "newPass123");

        when(userRepository.findByEmailIgnoreCase("jane@example.com"))
            .thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("oldPass", "$2b$12$hashed")).thenReturn(true);
        when(passwordEncoder.encode("newPass123")).thenReturn("$2b$12$newHashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.changePassword("jane@example.com", req);

        verify(passwordEncoder).matches("oldPass", "$2b$12$hashed");
        verify(passwordEncoder).encode("newPass123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword() — throws BadCredentialsException when current password is wrong")
    void changePassword_wrongCurrentPassword_throws() {
        User existing = User.builder()
            .id(1L).firstName("Jane").lastName("Doe")
            .email("jane@example.com").passwordHash("$2b$12$hashed")
            .role(User.Role.CUSTOMER).build();

        ChangePasswordRequest req = new ChangePasswordRequest("wrongPass", "newPass123");

        when(userRepository.findByEmailIgnoreCase("jane@example.com"))
            .thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("wrongPass", "$2b$12$hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword("jane@example.com", req))
            .isInstanceOf(BadCredentialsException.class)
            .hasMessageContaining("Current password is incorrect");

        verify(userRepository, never()).save(any());
    }
}
