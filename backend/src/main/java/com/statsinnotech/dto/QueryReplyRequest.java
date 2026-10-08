package com.statsinnotech.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QueryReplyRequest {

    @NotBlank(message = "Reply message cannot be empty")
    private String reply;

    private String status; // IN_PROGRESS, RESOLVED, CLOSED
}
