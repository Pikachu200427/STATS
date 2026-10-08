package com.statsinnotech.repository;

import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByStudentId(String studentId);
    java.util.List<Student> findAllByOrderByIdDesc();
}
