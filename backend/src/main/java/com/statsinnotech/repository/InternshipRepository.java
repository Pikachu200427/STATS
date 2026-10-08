package com.statsinnotech.repository;

import com.statsinnotech.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    Optional<Internship> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Internship> findByDomain(String domain);
    List<Internship> findByStatus(String status);
}
