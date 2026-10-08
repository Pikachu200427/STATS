package com.statsinnotech.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupportQueryRequest {

    @NotBlank(message = "Category is required")
    private String category; // COURSE, INTERNSHIP, DOCUMENT, TECHNICAL, BILLING

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    private String priority; // LOW, MEDIUM, HIGH
}
