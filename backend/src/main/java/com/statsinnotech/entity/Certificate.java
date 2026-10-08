package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String certificateNumber; // e.g. STATS-2026-CSE-0849 or STATS-AN-2026-CIV-0312

    @Column(unique = true, nullable = false)
    private String verificationCode; // Cryptographic lookup code

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String type; // INTERNSHIP, COURSE_COMPLETION

    @Column(nullable = false)
    private String title; // Program or course name

    @Column(nullable = false)
    private String domain; // CSE, CIVIL

    private String partnerName; // AN Survey Consultant if Civil
    private String grade; // e.g. Grade A+ (Distinction)
    private LocalDate issueDate;
    private String pdfPath;

    @Builder.Default
    private String status = "VERIFIED"; // VERIFIED, REVOKED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
