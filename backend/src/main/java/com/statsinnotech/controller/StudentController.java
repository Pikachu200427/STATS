package com.statsinnotech.controller;

import com.statsinnotech.dto.SupportQueryRequest;
import com.statsinnotech.entity.*;
import com.statsinnotech.repository.*;
import com.statsinnotech.service.CourseService;
import com.statsinnotech.service.InternshipService;
import com.statsinnotech.service.QueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final CourseService courseService;
    private final InternshipService internshipService;
    private final QueryService queryService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OfferLetterRepository offerLetterRepository;
    private final CertificateRepository certificateRepository;

    @GetMapping("/profile")
    public ResponseEntity<Student> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return ResponseEntity.ok(student);
    }

    @PutMapping("/profile")
    public ResponseEntity<Student> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        if (body.containsKey("firstName") && body.get("firstName") != null) {
            user.setFirstName(body.get("firstName").toString());
        }
        if (body.containsKey("lastName") && body.get("lastName") != null) {
            user.setLastName(body.get("lastName").toString());
        }
        if (body.containsKey("phone") && body.get("phone") != null) {
            user.setPhone(body.get("phone").toString());
            student.setPhone(body.get("phone").toString());
        }
        userRepository.save(user);

        if (body.containsKey("college") && body.get("college") != null) {
            student.setCollege(body.get("college").toString());
        }
        if (body.containsKey("degree") && body.get("degree") != null) {
            student.setDegree(body.get("degree").toString());
        }
        if (body.containsKey("branch") && body.get("branch") != null) {
            student.setBranch(body.get("branch").toString());
        }
        if (body.containsKey("graduationYear") && body.get("graduationYear") != null) {
            try {
                student.setGraduationYear(Integer.parseInt(body.get("graduationYear").toString()));
            } catch (NumberFormatException ignored) {}
        }
        if (body.containsKey("linkedinUrl") && body.get("linkedinUrl") != null) {
            student.setLinkedinUrl(body.get("linkedinUrl").toString());
        }
        if (body.containsKey("githubUrl") && body.get("githubUrl") != null) {
            student.setGithubUrl(body.get("githubUrl").toString());
        }
        if (body.containsKey("skills") && body.get("skills") != null) {
            student.setSkills(body.get("skills").toString());
        }

        return ResponseEntity.ok(studentRepository.save(student));
    }


    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<CourseEnrollment> enrollments = courseService.getStudentEnrollments(user.getEmail());
        List<InternshipApplication> applications = internshipService.getStudentApplications(user.getEmail());
        List<OfferLetter> offerLetters = offerLetterRepository.findByStudent(student);
        List<Certificate> certificates = certificateRepository.findByStudent(student);
        List<SupportQuery> queries = queryService.getStudentQueries(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("student", student);
        response.put("enrolledCoursesCount", enrollments.size());
        response.put("activeApplicationsCount", applications.size());
        response.put("offerLettersCount", offerLetters.size());
        response.put("certificatesCount", certificates.size());
        response.put("enrollments", enrollments);
        response.put("applications", applications);
        response.put("recentQueries", queries);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseEnrollment>> getEnrolledCourses(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(courseService.getStudentEnrollments(userDetails.getUsername()));
    }

    @PutMapping("/courses/{courseId}/progress")
    public ResponseEntity<CourseEnrollment> updateCourseProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long courseId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer progress = body.getOrDefault("progress", 0);
        return ResponseEntity.ok(courseService.updateProgress(userDetails.getUsername(), courseId, progress));
    }

    @PutMapping("/courses/by-slug/{slug}/progress")
    public ResponseEntity<CourseEnrollment> updateCourseProgressBySlug(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String slug,
            @RequestBody Map<String, Integer> body
    ) {
        Integer progress = body.getOrDefault("progress", 0);
        return ResponseEntity.ok(courseService.updateProgressBySlug(userDetails.getUsername(), slug, progress));
    }

    @GetMapping("/internships")
    public ResponseEntity<List<InternshipApplication>> getApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(internshipService.getStudentApplications(userDetails.getUsername()));
    }

    @GetMapping("/offer-letters")
    public ResponseEntity<List<OfferLetter>> getOfferLetters(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return ResponseEntity.ok(offerLetterRepository.findByStudent(student));
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<Certificate>> getCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return ResponseEntity.ok(certificateRepository.findByStudent(student));
    }

    @GetMapping("/queries")
    public ResponseEntity<List<SupportQuery>> getQueries(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(queryService.getStudentQueries(userDetails.getUsername()));
    }

    @PostMapping("/queries")
    public ResponseEntity<SupportQuery> submitQuery(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SupportQueryRequest request
    ) {
        return ResponseEntity.ok(queryService.createQuery(userDetails.getUsername(), request));
    }
}
