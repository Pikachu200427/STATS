package com.statsinnotech.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EnrollmentRequest {

    private Long courseId;
    private String slug;

    private String batchType; // WEEKEND, WEEKDAY
    private String paymentMethod; // UPI, CARD, NETBANKING
    private BigDecimal paidAmount;
    private String couponCode;
}
