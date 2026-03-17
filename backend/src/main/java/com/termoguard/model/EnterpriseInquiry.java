package com.termoguard.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

/**
 * Stores B2B enterprise contact form submissions.
 */
@Entity
@Table(name = "enterprise_inquiries")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @NotBlank
    @Column(name = "contact_name", nullable = false, length = 160)
    private String contactName;

    @Email
    @NotBlank
    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 40)
    private String phone;

    @Column(length = 100)
    private String industry;

    @Column(name = "facility_size", length = 60)
    private String facilitySize;

    @Column(name = "estimated_volume", length = 60)
    private String estimatedVolume;

    @Column(name = "deployment_timeline", length = 40)
    private String deploymentTimeline;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.NEW;

    @CreatedDate
    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public enum InquiryStatus {
        NEW, CONTACTED, IN_PROGRESS, CLOSED
    }
}
