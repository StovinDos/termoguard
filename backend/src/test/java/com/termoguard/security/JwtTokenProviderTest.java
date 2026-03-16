package com.termoguard.security;

import org.junit.jupiter.api.*;
import static org.assertj.core.api.Assertions.*;

class JwtTokenProviderTest {

    // Secret must be at least 256-bit (32 chars) for HS256
    private static final String SECRET      = "TestSecretKeyForUnitTestsMustBe256BitsOrMoreForHS256Algorithm!";
    private static final long   EXPIRY_MS   = 3_600_000L; // 1 hour

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(SECRET, EXPIRY_MS);
    }

    @Test
    @DisplayName("generateToken() produces a non-blank token")
    void generateToken_notBlank() {
        String token = tokenProvider.generateToken("jane@example.com", 1L, "CUSTOMER");
        assertThat(token).isNotBlank();
        // JWT has three dot-separated segments
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("getEmailFromToken() returns correct subject")
    void getEmailFromToken_correct() {
        String token = tokenProvider.generateToken("jane@example.com", 42L, "CUSTOMER");
        assertThat(tokenProvider.getEmailFromToken(token)).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("getUserIdFromToken() returns correct user id")
    void getUserIdFromToken_correct() {
        String token = tokenProvider.generateToken("jane@example.com", 42L, "CUSTOMER");
        assertThat(tokenProvider.getUserIdFromToken(token)).isEqualTo(42L);
    }

    @Test
    @DisplayName("validateToken() returns true for fresh token")
    void validateToken_freshToken_returnsTrue() {
        String token = tokenProvider.generateToken("jane@example.com", 1L, "CUSTOMER");
        assertThat(tokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("validateToken() returns false for garbage string")
    void validateToken_garbage_returnsFalse() {
        assertThat(tokenProvider.validateToken("not.a.jwt")).isFalse();
    }

    @Test
    @DisplayName("validateToken() returns false for token signed with wrong key")
    void validateToken_wrongKey_returnsFalse() {
        JwtTokenProvider otherProvider = new JwtTokenProvider(
            "CompletelyDifferentSecretKeyAlsoMustBe256BitsLongForHS256!!", EXPIRY_MS);
        String token = otherProvider.generateToken("attacker@evil.com", 999L, "ADMIN");
        assertThat(tokenProvider.validateToken(token)).isFalse();
    }
}
