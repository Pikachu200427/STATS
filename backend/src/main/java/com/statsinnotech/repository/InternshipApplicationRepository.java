package com.statsinnotech.repository;

import com.statsinnotech.entity.Internship;
import com.statsinnotech.entity.InternshipApplication;
import com.statsinnotech.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipApplicationRepository extends JpaRepository<InternshipApplication, Long> {
    List<InternshipApplication> findByStudent(Student student);
    List<InternshipApplication> findByStatus(String status);
    Optional<InternshipApplication> findByApplicationId(String applicationId);
    boolean existsByStudentAndInternship(Student student, Internship internship);
    List<InternshipApplication> findAllByOrderByIdDesc();
}
