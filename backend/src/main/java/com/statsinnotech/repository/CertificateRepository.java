package com.statsinnotech.repository;

import com.statsinnotech.entity.Certificate;
import com.statsinnotech.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudent(Student student);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    Optional<Certificate> findByVerificationCode(String verificationCode);
    List<Certificate> findAllByOrderByIdDesc();
}
