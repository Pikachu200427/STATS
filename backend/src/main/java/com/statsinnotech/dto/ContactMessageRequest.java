package com.statsinnotech.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactMessageRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address is required")
    private String email;

    private String phone;
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;
}
