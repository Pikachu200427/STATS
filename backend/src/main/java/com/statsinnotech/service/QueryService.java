package com.statsinnotech.service;

import com.statsinnotech.dto.QueryReplyRequest;
import com.statsinnotech.dto.SupportQueryRequest;
import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.SupportQuery;
import com.statsinnotech.entity.User;
import com.statsinnotech.repository.StudentRepository;
import com.statsinnotech.repository.SupportQueryRepository;
import com.statsinnotech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QueryService {

    private final SupportQueryRepository queryRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public SupportQuery createQuery(String userEmail, SupportQueryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        SupportQuery query = SupportQuery.builder()
                .student(student)
                .category(request.getCategory().toUpperCase())
                .subject(request.getSubject())
                .message(request.getMessage())
                .priority(request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM")
                .status("OPEN")
                .build();

        return queryRepository.save(query);
    }

    public List<SupportQuery> getStudentQueries(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        return queryRepository.findByStudent(student);
    }

    public List<SupportQuery> getAllQueries() {
        return queryRepository.findAll();
    }

    @Transactional
    public SupportQuery replyQuery(Long queryId, QueryReplyRequest request) {
        SupportQuery query = queryRepository.findById(queryId)
                .orElseThrow(() -> new IllegalArgumentException("Query not found with id: " + queryId));

        query.setAdminReply(request.getReply());
        query.setRepliedAt(LocalDateTime.now());
        if (request.getStatus() != null) {
            query.setStatus(request.getStatus().toUpperCase());
        } else {
            query.setStatus("RESOLVED");
        }

        SupportQuery saved = queryRepository.save(query);

        // Notify student by email
        String studentEmail = query.getStudent().getUser().getEmail();
        String studentName = query.getStudent().getUser().getFirstName();
        emailService.sendQueryReplyNotification(studentEmail, studentName, query.getSubject(), request.getReply());

        return saved;
    }
}
