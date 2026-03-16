package com.termoguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TermoGuardApplication {
    public static void main(String[] args) {
        SpringApplication.run(TermoGuardApplication.class, args);
    }
}
