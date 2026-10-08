package com.statsinnotech.repository;

import com.statsinnotech.entity.OfferLetter;
import com.statsinnotech.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferLetterRepository extends JpaRepository<OfferLetter, Long> {
    List<OfferLetter> findByStudent(Student student);
    Optional<OfferLetter> findByReferenceNumber(String referenceNumber);
    Optional<OfferLetter> findByVerificationCode(String verificationCode);
    List<OfferLetter> findAllByOrderByIdDesc();
}
