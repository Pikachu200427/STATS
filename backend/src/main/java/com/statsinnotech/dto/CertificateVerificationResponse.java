package com.statsinnotech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateVerificationResponse {

    private boolean verified;
    private String certificateNumber;
    private String verificationCode;
    private String studentName;
    private String programTitle;
    private String type; // INTERNSHIP, COURSE_COMPLETION
    private String domain; // CSE, CIVIL
    private String partnerName;
    private String grade;
    private LocalDate issueDate;
    private String status;
    private String verificationUrl;
}
