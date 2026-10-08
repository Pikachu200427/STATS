package com.statsinnotech.service;

import com.statsinnotech.dto.CertificateVerificationResponse;
import com.statsinnotech.entity.Certificate;
import com.statsinnotech.entity.OfferLetter;
import com.statsinnotech.repository.CertificateRepository;
import com.statsinnotech.repository.OfferLetterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final CertificateRepository certificateRepository;
    private final OfferLetterRepository offerLetterRepository;

    public CertificateVerificationResponse verifyCertificate(String query) {
        String cleanQuery = query.trim().toUpperCase();

        // 1. Search Certificate (by verificationCode e.g. SIT-CERT-501, or certificateNumber)
        Optional<Certificate> certOpt = certificateRepository.findByVerificationCode(cleanQuery);
        if (certOpt.isEmpty()) {
            certOpt = certificateRepository.findByCertificateNumber(cleanQuery);
        }

        if (certOpt.isPresent()) {
            Certificate cert = certOpt.get();
            String studentName = cert.getStudent() != null && cert.getStudent().getUser() != null
                    ? (cert.getStudent().getUser().getFirstName() + " " + cert.getStudent().getUser().getLastName()).trim()
                    : "Student";

            boolean isVerified = !"REVOKED".equalsIgnoreCase(cert.getStatus());

            return CertificateVerificationResponse.builder()
                    .verified(isVerified)
                    .certificateNumber(cert.getCertificateNumber())
                    .verificationCode(cert.getVerificationCode())
                    .studentName(studentName)
                    .programTitle(cert.getTitle())
                    .type(cert.getType() != null ? cert.getType() : "CERTIFICATE")
                    .domain(cert.getDomain())
                    .partnerName(cert.getPartnerName())
                    .grade(cert.getGrade())
                    .issueDate(cert.getIssueDate() != null ? cert.getIssueDate() : LocalDate.now())
                    .status(cert.getStatus() != null ? cert.getStatus() : "VERIFIED")
                    .verificationUrl("http://localhost:5173/verify-certificate?id=" + cert.getVerificationCode())
                    .build();
        }

        // 2. Search Offer Letter (by verificationCode e.g. SIT-OF-501, or referenceNumber)
        Optional<OfferLetter> olOpt = offerLetterRepository.findByVerificationCode(cleanQuery);
        if (olOpt.isEmpty()) {
            olOpt = offerLetterRepository.findByReferenceNumber(cleanQuery);
        }
        if (olOpt.isEmpty()) {
            olOpt = offerLetterRepository.findByReferenceNumber(query.trim());
        }

        if (olOpt.isPresent()) {
            OfferLetter ol = olOpt.get();
            String studentName = ol.getStudent() != null && ol.getStudent().getUser() != null
                    ? (ol.getStudent().getUser().getFirstName() + " " + ol.getStudent().getUser().getLastName()).trim()
                    : "Candidate";

            String prog = ol.getRoleTitle();
            if (prog == null && ol.getInternship() != null) {
                prog = ol.getInternship().getTitle();
            }

            boolean isVerified = !"REVOKED".equalsIgnoreCase(ol.getStatus()) && !"REJECTED".equalsIgnoreCase(ol.getStatus());

            return CertificateVerificationResponse.builder()
                    .verified(isVerified)
                    .certificateNumber(ol.getReferenceNumber())
                    .verificationCode(ol.getVerificationCode() != null ? ol.getVerificationCode() : ol.getReferenceNumber())
                    .studentName(studentName)
                    .programTitle(prog != null ? prog : "Industrial Internship")
                    .type("OFFER_LETTER")
                    .domain(ol.getDomain())
                    .partnerName(ol.getPartnerName())
                    .grade(ol.getStipendDetails())
                    .issueDate(ol.getIssuedDate() != null ? ol.getIssuedDate() : ol.getStartDate())
                    .status(ol.getStatus() != null ? ol.getStatus() : "ISSUED")
                    .verificationUrl("http://localhost:5173/verify-certificate?id=" + (ol.getVerificationCode() != null ? ol.getVerificationCode() : ol.getReferenceNumber()))
                    .build();
        }

        return CertificateVerificationResponse.builder()
                .verified(false)
                .build();
    }
}
