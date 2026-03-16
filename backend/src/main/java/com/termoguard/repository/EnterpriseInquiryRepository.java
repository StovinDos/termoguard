package com.termoguard.repository;

import com.termoguard.model.EnterpriseInquiry;
import com.termoguard.model.EnterpriseInquiry.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnterpriseInquiryRepository extends JpaRepository<EnterpriseInquiry, Long> {

    /** All inquiries with a given status, newest first (used by admin dashboard). */
    Page<EnterpriseInquiry> findByStatusOrderByCreatedAtDesc(InquiryStatus status, Pageable pageable);

    /** All inquiries from a given company name (case-insensitive partial match). */
    List<EnterpriseInquiry> findByCompanyNameContainingIgnoreCase(String companyName);
}
