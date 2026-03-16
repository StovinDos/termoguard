package com.termoguard.controller;

import com.termoguard.dto.EnterpriseDto.*;
import com.termoguard.service.EnterpriseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for B2B enterprise inquiries.
 * POST /api/enterprise/inquiry is PUBLIC (no authentication required).
 */
@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class EnterpriseController {

    private final EnterpriseService enterpriseService;

    @PostMapping("/inquiry")
    public ResponseEntity<InquiryResponse> submitInquiry(
        @Valid @RequestBody InquiryRequest request
    ) {
        InquiryResponse response = enterpriseService.submitInquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
