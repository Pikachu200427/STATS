package com.statsinnotech.service;

import com.statsinnotech.dto.InternshipApplicationRequest;
import com.statsinnotech.entity.Internship;
import com.statsinnotech.entity.InternshipApplication;
import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.User;
import com.statsinnotech.repository.InternshipApplicationRepository;
import com.statsinnotech.repository.InternshipRepository;
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
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final InternshipApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    public List<Internship> getInternshipsByDomain(String domain) {
        return internshipRepository.findByDomain(domain.toUpperCase());
    }

    public Internship getInternshipBySlug(String slug) {
        return internshipRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with slug: " + slug));
    }

    @Transactional
    public InternshipApplication apply(String userEmail, InternshipApplicationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user: " + userEmail));

        Internship internship = null;
        String requestedSlug = request.getSlug();
        if (requestedSlug != null && !requestedSlug.trim().isEmpty()) {
            internship = internshipRepository.findBySlug(requestedSlug.trim()).orElse(null);
            if (internship == null) {
                if ("aiml-internship".equals(requestedSlug)) {
                    internship = internshipRepository.findBySlug("ai-ml-internship").orElse(null);
                } else if ("ai-ml-internship".equals(requestedSlug)) {
                    internship = internshipRepository.findBySlug("aiml-internship").orElse(null);
                } else if ("aws-cloud-internship".equals(requestedSlug)) {
                    internship = internshipRepository.findBySlug("cloud-devops-internship").orElse(null);
                } else if ("cloud-devops-internship".equals(requestedSlug)) {
                    internship = internshipRepository.findBySlug("aws-cloud-internship").orElse(null);
                }
            }
        }

        if (internship == null && request.getInternshipId() != null) {
            internship = internshipRepository.findById(request.getInternshipId()).orElse(null);
        }

        if (internship == null && requestedSlug != null && !requestedSlug.trim().isEmpty()) {
            internship = createCatalogInternship(requestedSlug.trim());
        }

        if (internship == null) {
            throw new IllegalArgumentException("Internship track not found: " + (requestedSlug != null ? requestedSlug : request.getInternshipId()));
        }

        if (applicationRepository.existsByStudentAndInternship(student, internship)) {
            throw new IllegalStateException("You have already submitted an application for the " + internship.getTitle() + " program");
        }

        String prefix = "CIVIL".equalsIgnoreCase(internship.getDomain()) ? "STATS-CIV" : "STATS-CSE";
        String applicationId = prefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        InternshipApplication application = InternshipApplication.builder()
                .applicationId(applicationId)
                .student(student)
                .internship(internship)
                .preferredDuration(request.getPreferredDuration())
                .preferredMode(request.getPreferredMode())
                .resumeUrl(request.getResumeUrl())
                .githubUrl(request.getGithubUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .statementOfPurpose(request.getStatementOfPurpose())
                .status("PENDING")
                .appliedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    public List<InternshipApplication> getStudentApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        return applicationRepository.findByStudent(student);
    }

    public List<InternshipApplication> getAllApplications() {
        return applicationRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public InternshipApplication reviewApplication(Long applicationId, String status, String reviewNotes) {
        InternshipApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + applicationId));

        application.setStatus(status.toUpperCase());
        application.setReviewNotes(reviewNotes);
        application.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    private Internship createCatalogInternship(String slug) {
        String title;
        String domain = "CSE";
        String technology = "Modern Software Engineering Tools";
        String shortDesc = "Industrial internship program with hands-on projects.";
        String description = "Comprehensive industrial internship program offered by STATS INNOTECH.";
        String mode = "ONLINE";
        String duration = "4 Weeks / 8 Weeks";
        String stipend = "Performance-based + Milestone Grant";
        String partner = null;

        if (slug.contains("civil")) {
            title = "Civil Engineering Internship";
            domain = "CIVIL";
            technology = "AutoCAD Civil 3D, Total Station, GPS/GNSS, Levelling";
            shortDesc = "Field engineering and survey internship in association with AN Survey Consultant.";
            description = "Practical hands-on exposure to Total Station surveying, contour generation, and road drafting.";
            mode = "HYBRID";
            stipend = "Performance-based + Field Travel Allowances";
            partner = "AN Survey Consultant";
        } else if (slug.contains("data-analytics")) {
            title = "Data Analytics Internship";
            technology = "Python, SQL, Power BI, Excel";
            shortDesc = "Analyze real-world data and deliver insights using Python, SQL, and visualization tools.";
            description = "Gain hands-on experience in data collection, processing, analysis, and visualization.";
            stipend = "Performance-based + Rs. 8,000 Milestone Grant";
        } else if (slug.contains("dbms")) {
            title = "DBMS Internship";
            technology = "PostgreSQL, MySQL, SQL";
            shortDesc = "Design and manage real databases with SQL, optimization, and data modeling.";
            description = "Deep dive into database design, normalization, query optimization, and database administration.";
            stipend = "Performance-based + Rs. 7,500 Grant";
        } else if (slug.contains("aiml") || slug.contains("ai-ml")) {
            title = "AI & Machine Learning Internship";
            technology = "Python, TensorFlow, Scikit-learn";
            shortDesc = "Build AI/ML models and implement intelligent solutions using Python and TensorFlow.";
            description = "Explore the cutting edge of AI and Machine Learning. Build ML models and neural networks.";
            stipend = "Performance-based + Rs. 12,000 Research Grant";
        } else if (slug.contains("iot") || slug.contains("embedded")) {
            title = "IoT & Embedded Systems Internship";
            technology = "Arduino, Raspberry Pi, C/C++, Python";
            shortDesc = "Build IoT devices and embedded systems with Arduino, Raspberry Pi, and real hardware.";
            description = "Hands-on IoT and Embedded Systems training with microcontrollers and sensors.";
            mode = "HYBRID";
            stipend = "Performance-based + Hardware Kit Allowance";
        } else if (slug.contains("software-testing") || slug.contains("qa")) {
            title = "Software Testing Internship";
            technology = "Selenium, JUnit, Postman, JIRA";
            shortDesc = "Master software testing - manual testing, automation, API testing, and QA processes.";
            description = "Learn manual and automated software testing. Work on real applications and write test cases.";
            stipend = "Performance-based + Testing Bounty";
        } else if (slug.contains("java")) {
            title = "Java Development Internship";
            technology = "Java, Spring Boot, Maven, PostgreSQL";
            shortDesc = "Build production-ready Java applications with Spring Boot, REST APIs, and databases.";
            description = "Build enterprise-grade Java applications with Spring Boot and PostgreSQL.";
            stipend = "Performance-based + Rs. 10,000 Milestone Grant";
        } else if (slug.contains("python")) {
            title = "Python Development Internship";
            technology = "Python, Django/Flask, REST APIs";
            shortDesc = "Develop Python applications, REST APIs, and automation scripts in a real project environment.";
            description = "Develop Python applications and APIs, automation scripts, and backends.";
            stipend = "Performance-based + Rs. 8,000 Milestone Grant";
        } else if (slug.contains("cloud") || slug.contains("aws")) {
            title = "Cloud Computing (AWS) Internship";
            technology = "AWS, Linux, Docker, Terraform";
            shortDesc = "Deploy real applications on AWS - EC2, S3, Lambda, DevOps, and cloud architecture.";
            description = "Deploy and manage real applications on AWS with Docker and Terraform.";
            stipend = "Performance-based + AWS Cloud Certification Voucher";
        } else {
            title = slug.replace("-internship", "").replace("-", " ");
            title = Character.toUpperCase(title.charAt(0)) + title.substring(1) + " Internship";
        }

        Internship newInternship = Internship.builder()
                .title(title)
                .slug(slug)
                .domain(domain)
                .technology(technology)
                .shortDescription(shortDesc)
                .description(description)
                .duration(duration)
                .mode(mode)
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount(stipend)
                .partnerName(partner)
                .status("ACTIVE")
                .build();

        return internshipRepository.save(newInternship);
    }
}
