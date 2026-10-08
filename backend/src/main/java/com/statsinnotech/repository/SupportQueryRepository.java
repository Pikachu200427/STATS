package com.statsinnotech.repository;

import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.SupportQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportQueryRepository extends JpaRepository<SupportQuery, Long> {
    List<SupportQuery> findByStudent(Student student);
    List<SupportQuery> findByStatus(String status);
}
