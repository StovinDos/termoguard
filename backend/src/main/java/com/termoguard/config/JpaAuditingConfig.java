package com.termoguard.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Activates JPA auditing (auto-populated {@code @CreatedDate} /
 * {@code @LastModifiedDate} fields) only when a full JPA context
 * is present.
 *
 * Keeping this in a separate class (rather than on @SpringBootApplication)
 * prevents {@code @WebMvcTest} slice tests from failing with
 * "JPA metamodel must not be empty" because @WebMvcTest does not
 * load a JPA EntityManagerFactory.
 */
@Configuration
@EnableJpaAuditing
@ConditionalOnBean(EntityManagerFactory.class)
public class JpaAuditingConfig {}
