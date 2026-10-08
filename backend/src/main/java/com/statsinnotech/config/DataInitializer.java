package com.statsinnotech.config;

import com.statsinnotech.entity.*;
import com.statsinnotech.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final InternshipRepository internshipRepository;
    private final IndustryPartnerRepository partnerRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final InternshipApplicationRepository applicationRepository;
    private final OfferLetterRepository offerLetterRepository;
    private final CertificateRepository certificateRepository;
    private final SupportQueryRepository queryRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            log.info("Checking STATS INNOTECH database status and verifying seed data...");

        // 1. Admin User
        if (!userRepository.existsByEmail("admin@statsinnotech.in")) {
            User admin = User.builder()
                    .email("admin@statsinnotech.in")
                    .password(passwordEncoder.encode("Admin@123"))
                    .firstName("Platform")
                    .lastName("Admin")
                    .phone("+91 98765 00000")
                    .role(Role.ADMIN)
                    .isEmailVerified(true)
                    .build();
            userRepository.save(admin);
        }

        // 2. Student User & Profile
        Student savedStudent = null;
        if (!userRepository.existsByEmail("student@statsinnotech.in")) {
            User studentUser = User.builder()
                    .email("student@statsinnotech.in")
                    .password(passwordEncoder.encode("Student@123"))
                    .firstName("Rahul")
                    .lastName("Sharma")
                    .phone("+91 98765 43210")
                    .role(Role.STUDENT)
                    .isEmailVerified(true)
                    .build();
            User savedStudentUser = userRepository.save(studentUser);

            Student student = Student.builder()
                    .studentId("STATS-STU-001")
                    .user(savedStudentUser)
                    .college("National Institute of Technology")
                    .degree("B.Tech")
                    .branch("Computer Science & Engineering")
                    .graduationYear(2027)
                    .phone("+91 98765 43210")
                    .skills("Java, Spring Boot, React, PostgreSQL, Docker")
                    .linkedinUrl("https://linkedin.com/in/rahul-sharma-demo")
                    .githubUrl("https://github.com/rahul-sharma-demo")
                    .resumeUrl("https://drive.google.com/demo/resume.pdf")
                    .build();
            savedStudent = studentRepository.save(student);
        } else {
            savedStudent = studentRepository.findAll().stream().findFirst().orElse(null);
        }

        // Seed additional students if count < 4
        if (studentRepository.count() < 4) {
            createSampleStudent("priya@example.com", "Priya", "Sharma", "STATS-STU-002", "PICT Pune", "Information Technology", 2026, "+91 98765 43211", "React, TypeScript, Figma, UI/UX");
            createSampleStudent("arjun@example.com", "Arjun", "Singh", "STATS-STU-003", "COEP", "Civil Engineering", 2025, "+91 98765 43212", "AutoCAD Civil 3D, Total Station, GPS Surveying");
            createSampleStudent("anjali@example.com", "Anjali", "Patel", "STATS-STU-004", "MIT Pune", "Computer Science", 2026, "+91 98765 43213", "Python, Machine Learning, Data Analytics, AWS");
        }

        // 3. Industry Partner: AN Survey Consultant
        if (partnerRepository.count() == 0) {
            IndustryPartner anPartner = IndustryPartner.builder()
                    .name("AN Survey Consultant")
                    .industry("Civil Engineering, Land Surveying & Infrastructure")
                    .location("Patna, Bihar & Pan-India Survey Sites")
                    .contactPerson("Er. N. K. Verma (Chief Consultant)")
                    .email("contact@ansurvey.com")
                    .phone("+91 94310 XXXXX")
                    .mouValidTill("Dec 2028")
                    .description(
                            "Premier infrastructure and land surveying consultancy providing live site exposure, total station instruments, and certified surveying training to STATS INNOTECH students.")
                    .isActive(true)
                    .build();
            partnerRepository.save(anPartner);
        }

        // 4. Seed Complete Courses Catalog
        Course javaCourse = Course.builder()
                .title("Java (Core & Advanced)")
                .slug("java-core")
                .shortDescription("Master Java programming from OOP to Multithreading with real-world projects.")
                .description(
                        "Complete curriculum covering Java syntax, OOP, Collections, File I/O, Streams, and concurrency.")
                .category("Programming")
                .technology("Java 21")
                .instructor("Sujal Sharma")
                .duration("8 Weeks")
                .level("BEGINNER")
                .price(new BigDecimal("4999"))
                .discountPrice(new BigDecimal("2999"))
                .thumbnail("/assets/courses/java.png")
                .status("ACTIVE")
                .rating(4.9)
                .totalStudents(184)
                .build();

        Course pythonCourse = Course.builder()
                .title("Python for Developers")
                .slug("python")
                .shortDescription("Learn Python scripting, automation, APIs, and data science essentials.")
                .description("From variables and data structures to FastAPI and data manipulation libraries.")
                .category("Programming")
                .technology("Python 3.12")
                .instructor("Tanu Priya")
                .duration("7 Weeks")
                .level("BEGINNER")
                .price(new BigDecimal("4499"))
                .discountPrice(new BigDecimal("2499"))
                .status("ACTIVE")
                .rating(4.8)
                .totalStudents(142)
                .build();

        Course cCppCourse = Course.builder()
                .title("C & C++ Systems Programming")
                .slug("c-cpp")
                .shortDescription(
                        "Build strong foundations in memory management, pointers, and OOP systems programming.")
                .description("In-depth memory allocation, pointers, algorithms, and standard template library.")
                .category("Programming")
                .technology("C / C++")
                .instructor("Ayushi Singh")
                .duration("8 Weeks")
                .level("BEGINNER")
                .price(new BigDecimal("4499"))
                .discountPrice(new BigDecimal("2499"))
                .status("ACTIVE")
                .rating(4.8)
                .totalStudents(128)
                .build();

        Course mernCourse = Course.builder()
                .title("Full Stack Web Development (MERN)")
                .slug("mern-stack")
                .shortDescription("Modern full stack development with MongoDB, Express, React 19, and Node.js.")
                .description("Build production SaaS web apps, REST APIs, authentication, and state management.")
                .category("Web Development")
                .technology("MERN")
                .instructor("Sujal Sharma")
                .duration("10 Weeks")
                .level("INTERMEDIATE")
                .price(new BigDecimal("6999"))
                .discountPrice(new BigDecimal("3999"))
                .status("ACTIVE")
                .rating(4.9)
                .totalStudents(230)
                .build();

        Course cloudCourse = Course.builder()
                .title("Cloud Computing & AWS Architecture")
                .slug("cloud-computing")
                .shortDescription("Design highly available, scalable AWS cloud infrastructures.")
                .description("EC2, S3, RDS, VPC networking, IAM security, Docker on ECS, and Terraform.")
                .category("Cloud")
                .technology("AWS")
                .instructor("Shubham Verma")
                .duration("8 Weeks")
                .level("INTERMEDIATE")
                .price(new BigDecimal("6999"))
                .discountPrice(new BigDecimal("3999"))
                .status("ACTIVE")
                .rating(4.9)
                .totalStudents(98)
                .build();

        Course cyberCourse = Course.builder()
                .title("Cybersecurity & Ethical Hacking")
                .slug("cybersecurity")
                .shortDescription("Network defense, penetration testing, OWASP Top 10, and vulnerability assessment.")
                .description("Learn defensive and offensive security principles with hands-on lab exercises.")
                .category("Security")
                .technology("Security")
                .instructor("Ayushi Singh")
                .duration("8 Weeks")
                .level("INTERMEDIATE")
                .price(new BigDecimal("5999"))
                .discountPrice(new BigDecimal("3499"))
                .status("ACTIVE")
                .rating(4.8)
                .totalStudents(115)
                .build();

        Course aiCourse = Course.builder()
                .title("AI & Machine Learning")
                .slug("ai-ml")
                .shortDescription(
                        "From data science with NumPy & Pandas to Deep Learning neural networks with PyTorch.")
                .description("Applied machine learning algorithms, model training, evaluation, and LLM fine-tuning.")
                .category("AI/ML")
                .technology("Python, PyTorch")
                .instructor("Tanu Priya")
                .duration("12 Weeks")
                .level("ADVANCED")
                .price(new BigDecimal("7999"))
                .discountPrice(new BigDecimal("4499"))
                .status("ACTIVE")
                .rating(4.9)
                .totalStudents(175)
                .build();

        Course autocadCourse = Course.builder()
                .title("AutoCAD & Civil 3D Infrastructure")
                .slug("autocad-civil-3d")
                .shortDescription("2D drafting, 3D modeling, contour mapping, and highway corridor design.")
                .description("Industry standard civil engineering drafting in collaboration with AN Survey Consultant.")
                .category("Civil Engineering")
                .technology("AutoCAD, Civil 3D")
                .instructor("Er. N. K. Verma")
                .duration("8 Weeks")
                .level("BEGINNER")
                .price(new BigDecimal("5999"))
                .discountPrice(new BigDecimal("3499"))
                .status("ACTIVE")
                .rating(4.8)
                .totalStudents(90)
                .build();

        Course revitCourse = Course.builder()
                .title("Revit Architecture & BIM Modeling")
                .slug("revit-bim")
                .shortDescription("Parametric architectural design, building information modeling, and MEP schedules.")
                .description("Complete architectural workflows from conceptual massing to construction documentation.")
                .category("Civil Engineering")
                .technology("Autodesk Revit")
                .instructor("Er. N. K. Verma")
                .duration("8 Weeks")
                .level("INTERMEDIATE")
                .price(new BigDecimal("6499"))
                .discountPrice(new BigDecimal("3999"))
                .status("ACTIVE")
                .rating(4.8)
                .totalStudents(76)
                .build();

        Course staadCourse = Course.builder()
                .title("STAAD.Pro Structural Analysis")
                .slug("staad-pro")
                .shortDescription(
                        "RCC and steel building analysis, seismic design, wind load simulation according to IS codes.")
                .description("Rigorous structural engineering methodology for commercial and industrial structures.")
                .category("Civil Engineering")
                .technology("STAAD.Pro")
                .instructor("Er. N. K. Verma")
                .duration("8 Weeks")
                .level("ADVANCED")
                .price(new BigDecimal("6999"))
                .discountPrice(new BigDecimal("3999"))
                .status("ACTIVE")
                .rating(4.9)
                .totalStudents(84)
                .build();

        // 4. Seed Complete Courses Catalog
        Course savedJava = seedCourseIfMissing(javaCourse);
        seedCourseIfMissing(pythonCourse);
        seedCourseIfMissing(cCppCourse);
        seedCourseIfMissing(mernCourse);
        seedCourseIfMissing(cloudCourse);
        seedCourseIfMissing(cyberCourse);
        seedCourseIfMissing(aiCourse);
        seedCourseIfMissing(autocadCourse);
        seedCourseIfMissing(revitCourse);
        seedCourseIfMissing(staadCourse);

        // 5. Seed Internships Catalog
        Internship fullstackIntern = Internship.builder()
                .title("Full Stack Web Development Internship")
                .slug("web-development-internship")
                .domain("CSE")
                .technology("React 19, Node.js, PostgreSQL, Tailwind")
                .shortDescription("Build real client-facing web applications with modern React and REST APIs.")
                .description("Work on production startup modules, participate in code reviews, and deploy on cloud.")
                .duration("8 Weeks / 12 Weeks")
                .mode("ONLINE")
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount("Performance-based + ₹10,000 Milestone Grant")
                .status("ACTIVE")
                .build();

        Internship civilIntern = Internship.builder()
                .title("Civil Engineering Internship")
                .slug("civil-engineering-internship")
                .domain("CIVIL")
                .technology("AutoCAD Civil 3D, Total Station, GPS/GNSS, Levelling")
                .shortDescription("Field engineering and survey internship in association with AN Survey Consultant.")
                .description(
                        "Practical hands-on exposure to Total Station surveying, contour generation, road cross-sections, and drawing drafting.")
                .duration("4 Weeks / 8 Weeks")
                .mode("HYBRID")
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount("Performance-based + Field Travel Allowances")
                .partnerName("AN Survey Consultant")
                .status("ACTIVE")
                .build();

        Internship cloudIntern = Internship.builder()
                .title("Cloud & DevOps Engineering Internship")
                .slug("cloud-devops-internship")
                .domain("CSE")
                .technology("AWS, Docker, Kubernetes, GitHub Actions, Terraform")
                .shortDescription(
                        "Implement automated CI/CD pipelines, container orchestration, and cloud infrastructure.")
                .description("Work alongside senior DevOps engineers to automate provisioning and monitoring.")
                .duration("8 Weeks / 12 Weeks")
                .mode("ONLINE")
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount("Performance-based + Certification Grant")
                .status("ACTIVE")
                .build();

        Internship aiIntern = Internship.builder()
                .title("AI & Machine Learning Internship")
                .slug("ai-ml-internship")
                .domain("CSE")
                .technology("Python, PyTorch, Scikit-learn, OpenCV, HuggingFace")
                .shortDescription("Develop computer vision models, NLP pipelines, and generative AI prototypes.")
                .description(
                        "Clean datasets, optimize inference latencies, and deploy models as scalable microservices.")
                .duration("8 Weeks / 12 Weeks")
                .mode("ONLINE")
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount("Performance-based + Research Stipend")
                .status("ACTIVE")
                .build();

        Internship cyberIntern = Internship.builder()
                .title("Cybersecurity & SOC Analyst Internship")
                .slug("cybersecurity-internship")
                .domain("CSE")
                .technology("Wireshark, Metasploit, SIEM, Snort, Linux Security")
                .shortDescription(
                        "Hands-on security monitoring, threat detection, and ethical vulnerability remediation.")
                .description(
                        "Simulate adversary techniques, analyze audit logs, and formulate incident response runbooks.")
                .duration("8 Weeks / 12 Weeks")
                .mode("ONLINE")
                .stipendType("PERFORMANCE_BASED")
                .stipendAmount("Performance-based + Security Bounty")
                .status("ACTIVE")
                .build();

        Internship savedFullstack = seedInternshipIfMissing(fullstackIntern);
        seedInternshipIfMissing(civilIntern);
        seedInternshipIfMissing(cloudIntern);
        seedInternshipIfMissing(aiIntern);
        seedInternshipIfMissing(cyberIntern);

        // 6. Seed Sample Enrollment
        if (enrollmentRepository.count() == 0 && savedStudent != null && savedJava != null) {
            CourseEnrollment enrollment = CourseEnrollment.builder()
                    .enrollmentId("STATS-ENR-094182")
                    .student(savedStudent)
                    .course(savedJava)
                    .status("ACTIVE")
                    .progress(65)
                    .paymentStatus("PAID")
                    .paymentAmount(new BigDecimal("2999"))
                    .batchType("WEEKEND")
                    .enrolledAt(LocalDateTime.now().minusWeeks(3))
                    .build();
            enrollmentRepository.save(enrollment);
        }

        // 7. Seed Sample Internship Application
        if (applicationRepository.count() == 0 && savedStudent != null && savedFullstack != null) {
            InternshipApplication app = InternshipApplication.builder()
                    .applicationId("STATS-APP-CSE-81024")
                    .student(savedStudent)
                    .internship(savedFullstack)
                    .preferredDuration("2 Months")
                    .preferredMode("Remote Online")
                    .resumeUrl("https://drive.google.com/demo/resume.pdf")
                    .githubUrl("https://github.com/rahul-sharma-demo")
                    .statementOfPurpose("Passionate about distributed web architectures and React.")
                    .status("APPROVED")
                    .appliedAt(LocalDateTime.now().minusWeeks(4))
                    .reviewedAt(LocalDateTime.now().minusWeeks(3))
                    .build();
            applicationRepository.save(app);
        }

        // 8. Seed Offer Letter
        if (offerLetterRepository.count() == 0 && savedStudent != null && savedFullstack != null) {
            OfferLetter offerLetter = OfferLetter.builder()
                    .referenceNumber("STATS/OL/2026/CSE/0104")
                    .verificationCode("SIT-OF-501")
                    .student(savedStudent)
                    .internship(savedFullstack)
                    .domain("CSE")
                    .roleTitle("Full Stack Web Developer Intern")
                    .stipendDetails("Performance-based + ₹10,000 Milestone Grant")
                    .startDate(LocalDate.now().minusDays(10))
                    .issuedDate(LocalDate.now().minusDays(14))
                    .status("ACCEPTED")
                    .build();
            offerLetterRepository.save(offerLetter);
        }

        // Backfill any offer letters without SIT-OF-XXX code
        List<OfferLetter> existingOffers = offerLetterRepository.findAll();
        int curOfferSeq = 501;
        for (OfferLetter ol : existingOffers) {
            if (ol.getVerificationCode() == null || ol.getVerificationCode().isBlank() || !ol.getVerificationCode().startsWith("SIT-OF-")) {
                ol.setVerificationCode("SIT-OF-" + curOfferSeq);
                offerLetterRepository.save(ol);
            }
            try {
                if (ol.getVerificationCode() != null && ol.getVerificationCode().startsWith("SIT-OF-")) {
                    int num = Integer.parseInt(ol.getVerificationCode().replace("SIT-OF-", ""));
                    if (num >= curOfferSeq) curOfferSeq = num + 1;
                }
            } catch (Exception ignored) {}
        }

        // 9. Seed Sample Certificate
        if (certificateRepository.count() == 0 && savedStudent != null) {
            Certificate certificate = Certificate.builder()
                    .certificateNumber("STATS-2026-CSE-0849")
                    .verificationCode("SIT-CERT-501")
                    .student(savedStudent)
                    .type("INTERNSHIP")
                    .title("Full Stack Web Development Internship")
                    .domain("CSE")
                    .grade("Grade A+ (Distinction)")
                    .issueDate(LocalDate.now().minusDays(5))
                    .status("VERIFIED")
                    .build();
            certificateRepository.save(certificate);
        }

        // Backfill any certificates without SIT-CERT-XXX code
        List<Certificate> existingCerts = certificateRepository.findAll();
        int curCertSeq = 501;
        for (Certificate c : existingCerts) {
            if (c.getVerificationCode() == null || c.getVerificationCode().isBlank() || !c.getVerificationCode().startsWith("SIT-CERT-")) {
                c.setVerificationCode("SIT-CERT-" + curCertSeq);
                certificateRepository.save(c);
            }
            try {
                if (c.getVerificationCode() != null && c.getVerificationCode().startsWith("SIT-CERT-")) {
                    int num = Integer.parseInt(c.getVerificationCode().replace("SIT-CERT-", ""));
                    if (num >= curCertSeq) curCertSeq = num + 1;
                }
            } catch (Exception ignored) {}
        }

        // 10. Seed Sample Support Query
        if (queryRepository.count() == 0 && savedStudent != null) {
            SupportQuery query = SupportQuery.builder()
                    .student(savedStudent)
                    .category("INTERNSHIP")
                    .subject("Kafka Consumer Group Rebalance in Milestone 4")
                    .message(
                            "I am experiencing frequent consumer group rebalances when running 3 instances of the order processing microservice.")
                    .priority("HIGH")
                    .status("RESOLVED")
                    .adminReply(
                            "Please adjust the max.poll.interval.ms configuration from 300000 to 600000 to allow sufficient batch processing time.")
                    .repliedAt(LocalDateTime.now().minusDays(1))
                    .build();
            queryRepository.save(query);
        }

        // 11. Seed Sample Enquiries & Project Development Requests
        if (contactMessageRepository.count() == 0) {
            contactMessageRepository.save(ContactMessage.builder()
                    .name("Vikas Agarwal")
                    .email("vikas@agarwalconstructions.in")
                    .phone("+91 98201 12345")
                    .subject("Corporate Surveying Training for 20 Engineers")
                    .message("We would like to train our site engineers in Total Station and GPS surveying using your partnership module with AN Survey Consultant.")
                    .isRead(false)
                    .build());
            contactMessageRepository.save(ContactMessage.builder()
                    .name("Meera Deshmukh")
                    .email("meera.deshmukh@gmail.com")
                    .phone("+91 94220 98765")
                    .subject("Batch timing inquiry for Full Stack MERN")
                    .message("Are weekend live sessions recorded for asynchronous review? Want to confirm before proceeding with batch registration.")
                    .isRead(true)
                    .build());
        }

        boolean hasProjectEnquiry = contactMessageRepository.findAll().stream()
                .anyMatch(m -> m.getSubject() != null && m.getSubject().contains("Project"));
        if (!hasProjectEnquiry) {
            contactMessageRepository.save(ContactMessage.builder()
                    .name("Rohan Kulkarni")
                    .email("rohan.kulkarni@engg.edu")
                    .phone("+91 98234 56789")
                    .subject("[Project Development Request] AI & Machine Learning - B.Tech 4th Year")
                    .message("Student Name: Rohan Kulkarni\nCollege/University: Pune Institute of Computer Technology\nDegree & Year: B.Tech 4th Year (Final Year Project)\nDomain: Artificial Intelligence & Machine Learning\nTopic Status: Wants topic suggestions from STATS experts\nTarget Submission Deadline: Nov 30, 2026\nNotes/Requirements: Need IEEE paper based project with working Flask/FastAPI backend, clean dataset, and interactive UI dashboard.")
                    .isRead(false)
                    .build());
            contactMessageRepository.save(ContactMessage.builder()
                    .name("Sneha Mukherjee")
                    .email("sneha.civil@jadavpur.edu")
                    .phone("+91 97480 11223")
                    .subject("[Project Development Request] Civil Engineering - B.Tech 4th Year")
                    .message("Student Name: Sneha Mukherjee\nCollege/University: Jadavpur University\nDegree & Year: B.Tech 4th Year\nDomain: Civil Survey & Geomatics\nTopic Status: Already has a topic\nProposed Topic/Idea: Digital Terrain Modeling and Highway Alignment Design using Leica Total Station and Civil 3D\nTarget Submission Deadline: Dec 15, 2026\nNotes/Requirements: Require AN Survey Consultant co-stamped validation report for university department.")
                    .isRead(false)
                    .build());
            contactMessageRepository.save(ContactMessage.builder()
                    .name("Aditya Verma")
                    .email("aditya.cloud@bitspilani.edu")
                    .phone("+91 98110 33445")
                    .subject("[Project Development Request] Cloud & DevOps - B.Tech 4th Year")
                    .message("Student Name: Aditya Verma\nCollege/University: BITS Pilani\nDegree & Year: B.Tech 4th Year\nDomain: Cloud DevOps\nTopic Status: Wants topic suggestions from STATS experts\nTarget Submission Deadline: Nov 20, 2026\nNotes/Requirements: Looking for GitOps Kubernetes deployment with Terraform and Prometheus Grafana monitoring.")
                    .isRead(false)
                    .build());
        }

            log.info(
                    "Database seeding verified successfully! Default admin: admin@statsinnotech.in / Admin@123, student: student@statsinnotech.in / Student@123");
        } catch (Exception e) {
            log.warn("Database seed note: {} (non-critical, continuing application startup)", e.getMessage());
        }
    }

    private void createSampleStudent(String email, String firstName, String lastName, String studentId, String college, String branch, int gradYear, String phone, String skills) {
        if (userRepository.existsByEmail(email)) return;
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode("Student@123"))
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .role(Role.STUDENT)
                .isEmailVerified(true)
                .build();
        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .studentId(studentId)
                .user(savedUser)
                .college(college)
                .degree("B.Tech")
                .branch(branch)
                .graduationYear(gradYear)
                .phone(phone)
                .skills(skills)
                .build();
        studentRepository.save(student);
    }

    private Course seedCourseIfMissing(Course c) {
        if (!courseRepository.existsBySlug(c.getSlug())) {
            return courseRepository.save(c);
        }
        return courseRepository.findBySlug(c.getSlug()).orElse(null);
    }

    private Internship seedInternshipIfMissing(Internship i) {
        if (!internshipRepository.existsBySlug(i.getSlug())) {
            return internshipRepository.save(i);
        }
        return internshipRepository.findBySlug(i.getSlug()).orElse(null);
    }
}
