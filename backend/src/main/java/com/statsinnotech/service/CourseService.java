package com.statsinnotech.service;

import com.statsinnotech.dto.EnrollmentRequest;
import com.statsinnotech.entity.Course;
import com.statsinnotech.entity.CourseEnrollment;
import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.User;
import com.statsinnotech.repository.CourseEnrollmentRepository;
import com.statsinnotech.repository.CourseRepository;
import com.statsinnotech.repository.StudentRepository;
import com.statsinnotech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseBySlug(String slug) {
        return courseRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with slug: " + slug));
    }

    @Transactional
    public Course createCourse(Course course) {
        if (course.getSlug() == null || course.getSlug().isBlank()) {
            course.setSlug(course.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, Course updated) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setShortDescription(updated.getShortDescription());
        existing.setDescription(updated.getDescription());
        existing.setTechnology(updated.getTechnology());
        existing.setLevel(updated.getLevel());
        existing.setPrice(updated.getPrice());
        existing.setDiscountPrice(updated.getDiscountPrice());
        existing.setStatus(updated.getStatus());
        existing.setDuration(updated.getDuration());

        return courseRepository.save(existing);
    }

    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @Transactional
    public CourseEnrollment enroll(String userEmail, EnrollmentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user: " + userEmail));

        Course course = null;
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            course = courseRepository.findBySlug(request.getSlug().trim()).orElse(null);
        }
        if (course == null && request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId()).orElse(null);
        }

        if (course == null) {
            throw new IllegalArgumentException("Course not found for enrollment");
        }

        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }

        String enrollmentId = "STATS-ENR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .enrollmentId(enrollmentId)
                .student(student)
                .course(course)
                .status("ACTIVE")
                .progress(0)
                .paymentStatus("PAID")
                .paymentAmount(request.getPaidAmount() != null ? request.getPaidAmount() : course.getDiscountPrice())
                .batchType(request.getBatchType() != null ? request.getBatchType() : "WEEKEND")
                .enrolledAt(LocalDateTime.now())
                .build();

        CourseEnrollment saved = enrollmentRepository.save(enrollment);

        // Increment student count
        course.setTotalStudents(course.getTotalStudents() + 1);
        courseRepository.save(course);

        // Send email
        emailService.sendEnrollmentConfirmation(user.getEmail(), user.getFirstName(), course.getTitle(), enrollmentId);

        return saved;
    }

    public List<CourseEnrollment> getStudentEnrollments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        return enrollmentRepository.findByStudent(student);
    }

    @Transactional
    public CourseEnrollment updateProgress(String userEmail, Long courseId, Integer progress) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        CourseEnrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found for this course"));

        int val = Math.min(100, Math.max(0, progress != null ? progress : 0));
        enrollment.setProgress(val);
        if (val >= 100) {
            enrollment.setStatus("COMPLETED");
            if (enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
        }
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public CourseEnrollment updateProgressBySlug(String userEmail, String slug, Integer progress) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with slug: " + slug));
        CourseEnrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found for this course"));

        int val = Math.min(100, Math.max(0, progress != null ? progress : 0));
        enrollment.setProgress(val);
        if (val >= 100) {
            enrollment.setStatus("COMPLETED");
            if (enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
        }
        return enrollmentRepository.save(enrollment);
    }
}
