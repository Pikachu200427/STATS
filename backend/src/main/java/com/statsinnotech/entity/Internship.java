package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "internships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String domain; // CSE, CIVIL

    private String technology;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration; // e.g. 4 Weeks, 8 Weeks, 12 Weeks

    @Builder.Default
    private String mode = "ONLINE"; // ONLINE, HYBRID, OFFLINE

    private String stipendType; // PERFORMANCE_BASED, FIXED, UNPAID
    private String stipendAmount;
    private String partnerName; // e.g. AN Survey Consultant

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, CLOSED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
