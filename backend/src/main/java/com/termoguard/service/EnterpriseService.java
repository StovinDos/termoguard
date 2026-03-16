package com.termoguard.service;

import com.termoguard.dto.EnterpriseDto.*;
import com.termoguard.model.EnterpriseInquiry;
import com.termoguard.repository.EnterpriseInquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnterpriseService {

    private final EnterpriseInquiryRepository inquiryRepository;

    @Transactional
    public InquiryResponse submitInquiry(InquiryRequest request) {
        EnterpriseInquiry inquiry = EnterpriseInquiry.builder()
            .companyName(request.getCompanyName())
            .contactName(request.getContactName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .industry(request.getIndustry())
            .facilitySize(request.getFacilitySize())
            .estimatedVolume(request.getEstimatedVolume())
            .deploymentTimeline(request.getDeploymentTimeline())
            .message(request.getMessage())
            .build();

        inquiry = inquiryRepository.save(inquiry);
        log.info("Enterprise inquiry received: id={} company={}", inquiry.getId(), inquiry.getCompanyName());

        // TODO: send confirmation email via Spring Mail / SendGrid

        return InquiryResponse.builder()
            .id(inquiry.getId())
            .status("RECEIVED")
            .message("Thank you. A solutions engineer will contact you within 1 business day.")
            .build();
    }
}
