package com.termoguard.repository;

import com.termoguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User} entities.
 *
 * Spring automatically generates the SQL implementation at runtime —
 * no implementation class is required.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address (case-insensitive).
     * Used during login and duplicate-email validation.
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Check whether an email is already registered.
     * More efficient than loading the full entity just to check existence.
     */
    boolean existsByEmailIgnoreCase(String email);

    /**
     * Load only the fields needed for JWT subject claims — avoids
     * selecting the password hash when it isn't needed.
     */
    @Query("SELECT u.id FROM User u WHERE u.email = :email")
    Optional<Long> findIdByEmail(String email);
}
