package com.statsinnotech.repository;

import com.statsinnotech.entity.IndustryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndustryPartnerRepository extends JpaRepository<IndustryPartner, Long> {
    Optional<IndustryPartner> findByName(String name);
    List<IndustryPartner> findByIsActiveTrue();
}
