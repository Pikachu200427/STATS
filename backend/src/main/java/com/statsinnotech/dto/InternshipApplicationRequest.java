package com.statsinnotech.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InternshipApplicationRequest {

    private Long internshipId;
    private String slug;

    private String preferredDuration;
    private String preferredMode;

    @NotBlank(message = "Resume link is required")
    private String resumeUrl;

    private String githubUrl;
    private String linkedinUrl;
    private String statementOfPurpose;
}

