package com.statsinnotech.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String technology;
    private String instructor;
    private String duration;

    @Column(nullable = false)
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discountPrice;

    private String thumbnail;

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, FULL

    @Builder.Default
    private Double rating = 4.8;

    @Builder.Default
    private Integer totalStudents = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
