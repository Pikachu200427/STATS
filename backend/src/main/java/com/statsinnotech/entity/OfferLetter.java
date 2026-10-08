package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offer_letters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String referenceNumber; // e.g. STATS/OL/2026/CSE/0104 or STATS-AN/OL/2026/CIVIL/0048

    @Column(unique = true)
    private String verificationCode; // e.g. SIT-OF-501

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Column(nullable = false)
    private String domain; // CSE, CIVIL

    private String partnerName; // AN Survey Consultant if Civil
    private String roleTitle;
    private String stipendDetails;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate issuedDate;

    private String pdfPath;

    @Builder.Default
    private String status = "ISSUED"; // ISSUED, ACCEPTED, REVOKED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
