package com.statsinnotech.controller;

import com.statsinnotech.dto.EnrollmentRequest;
import com.statsinnotech.entity.Course;
import com.statsinnotech.entity.CourseEnrollment;
import com.statsinnotech.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Course> getCourseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(courseService.getCourseBySlug(slug));
    }

    @PostMapping("/enroll")
    public ResponseEntity<CourseEnrollment> enroll(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EnrollmentRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        CourseEnrollment enrollment = courseService.enroll(userDetails.getUsername(), request);
        return ResponseEntity.ok(enrollment);
    }
}
