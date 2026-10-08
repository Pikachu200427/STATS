package com.statsinnotech.repository;

import com.statsinnotech.entity.Course;
import com.statsinnotech.entity.CourseEnrollment;
import com.statsinnotech.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByStudent(Student student);
    Optional<CourseEnrollment> findByEnrollmentId(String enrollmentId);
    Optional<CourseEnrollment> findByStudentAndCourse(Student student, Course course);
    boolean existsByStudentAndCourse(Student student, Course course);
    List<CourseEnrollment> findAllByOrderByIdDesc();
}
