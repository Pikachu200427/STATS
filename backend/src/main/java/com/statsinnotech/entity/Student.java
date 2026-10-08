package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String studentId; // e.g. STATS-STU-001

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private String phone;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;

    @Column(length = 1000)
    private String skills;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
