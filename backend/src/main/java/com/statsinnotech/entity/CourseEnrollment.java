package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String enrollmentId; // e.g. STATS-ENR-481920

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, DROPPED

    @Builder.Default
    private Integer progress = 0; // 0 - 100 percentage

    @Builder.Default
    private String paymentStatus = "PAID"; // PENDING, PAID, REFUNDED

    private BigDecimal paymentAmount;
    private String batchType; // WEEKEND, WEEKDAY

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime enrolledAt;

    private LocalDateTime completedAt;
}
