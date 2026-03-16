package com.termoguard.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class EnterpriseDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InquiryRequest {

        @NotBlank(message = "Company name is required")
        @Size(max = 200)
        private String companyName;

        @NotBlank(message = "Contact name is required")
        @Size(max = 160)
        private String contactName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        private String email;

        @Size(max = 40)
        private String phone;

        @NotBlank(message = "Industry is required")
        @Size(max = 100)
        private String industry;

        @NotBlank(message = "Facility size is required")
        @Size(max = 60)
        private String facilitySize;

        @NotBlank(message = "Estimated volume is required")
        @Size(max = 60)
        private String estimatedVolume;

        @Size(max = 40)
        private String deploymentTimeline;

        @Size(max = 2000)
        private String message;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class InquiryResponse {
        private Long   id;
        private String status;
        private String message;
    }
}
