package com.statsinnotech.controller;

import com.statsinnotech.dto.QueryReplyRequest;
import com.statsinnotech.entity.*;
import com.statsinnotech.repository.*;
import com.statsinnotech.service.CourseService;
import com.statsinnotech.service.EmailService;
import com.statsinnotech.service.InternshipService;
import com.statsinnotech.service.QueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final InternshipRepository internshipRepository;
    private final InternshipApplicationRepository applicationRepository;
    private final OfferLetterRepository offerLetterRepository;
    private final CertificateRepository certificateRepository;
    private final SupportQueryRepository queryRepository;
    private final IndustryPartnerRepository partnerRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final CourseService courseService;
    private final InternshipService internshipService;
    private final QueryService queryService;
    private final EmailService emailService;
    private final com.statsinnotech.service.FileStorageService fileStorageService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalInternships", internshipRepository.count());
        stats.put("totalEnrollments", enrollmentRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pendingApplications", applicationRepository.findByStatus("PENDING").size());
        stats.put("totalOfferLetters", offerLetterRepository.count());
        stats.put("totalCertificates", certificateRepository.count());
        stats.put("openQueries", queryRepository.findByStatus("OPEN").size());
        stats.put("unreadMessages", contactMessageRepository.findByIsReadFalse().size());
        stats.put("activePartners", partnerRepository.findByIsActiveTrue().size());

        return ResponseEntity.ok(stats);
    }

    // Students
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAllByOrderByIdDesc());
    }

    // Courses CRUD
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // Internships CRUD
    @GetMapping("/internships")
    public ResponseEntity<List<Internship>> getAllInternships() {
        return ResponseEntity.ok(internshipRepository.findAll());
    }

    @PostMapping("/internships")
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) {
        if (internship.getSlug() == null || internship.getSlug().isBlank()) {
            internship.setSlug(internship.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return ResponseEntity.ok(internshipRepository.save(internship));
    }

    @PutMapping("/internships/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship updated) {
        Internship existing = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setDomain(updated.getDomain());
        existing.setDuration(updated.getDuration());
        existing.setStipendType(updated.getStipendType());
        existing.setStipendAmount(updated.getStipendAmount());
        existing.setShortDescription(updated.getShortDescription());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());

        return ResponseEntity.ok(internshipRepository.save(existing));
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        internshipRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Applications Review
    @GetMapping("/applications")
    public ResponseEntity<List<InternshipApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @PatchMapping("/applications/{id}")
    public ResponseEntity<InternshipApplication> reviewApplication(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reviewNotes
    ) {
        return ResponseEntity.ok(internshipService.reviewApplication(id, status, reviewNotes));
    }

    // Offer Letters Management
    @GetMapping("/offer-letters")
    public ResponseEntity<List<OfferLetter>> getAllOfferLetters() {
        return ResponseEntity.ok(offerLetterRepository.findAllByOrderByIdDesc());
    }

    public synchronized String generateNextOfferLetterVerificationCode() {
        List<OfferLetter> letters = offerLetterRepository.findAll();
        int maxNum = 500;
        for (OfferLetter ol : letters) {
            String code = ol.getVerificationCode();
            if (code != null && code.toUpperCase().startsWith("SIT-OF-")) {
                try {
                    int num = Integer.parseInt(code.toUpperCase().replace("SIT-OF-", "").trim());
                    if (num > maxNum) {
                        maxNum = num;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        return "SIT-OF-" + (maxNum + 1);
    }

    public synchronized String generateNextCertificateVerificationCode() {
        List<Certificate> certs = certificateRepository.findAll();
        int maxNum = 500;
        for (Certificate c : certs) {
            String code = c.getVerificationCode();
            if (code != null && code.toUpperCase().startsWith("SIT-CERT-")) {
                try {
                    int num = Integer.parseInt(code.toUpperCase().replace("SIT-CERT-", "").trim());
                    if (num > maxNum) {
                        maxNum = num;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        return "SIT-CERT-" + (maxNum + 1);
    }

    @PostMapping(value = "/offer-letters")
    public ResponseEntity<OfferLetter> issueOfferLetter(
            @RequestParam Long studentId,
            @RequestParam Long internshipId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String stipend,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "sendEmail", required = false, defaultValue = "true") boolean sendEmail
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found"));

        boolean isCivil = "CIVIL".equalsIgnoreCase(internship.getDomain());
        String prefix = isCivil ? "STATS-AN/OL/2026/CIVIL" : "STATS/OL/2026/CSE";
        String refNo = prefix + "/" + String.format("%04d", new Random().nextInt(9000) + 1000);
        String vCode = generateNextOfferLetterVerificationCode();

        String savedFilePath = null;
        if (file != null && !file.isEmpty()) {
            savedFilePath = fileStorageService.saveOfferLetterFile(file, refNo);
        }

        OfferLetter letter = OfferLetter.builder()
                .referenceNumber(refNo)
                .verificationCode(vCode)
                .student(student)
                .internship(internship)
                .domain(internship.getDomain())
                .partnerName(isCivil ? "AN Survey Consultant" : null)
                .roleTitle(internship.getTitle() + " Intern")
                .stipendDetails(stipend != null ? stipend : internship.getStipendAmount())
                .startDate(startDate != null ? LocalDate.parse(startDate) : LocalDate.now().plusDays(7))
                .issuedDate(LocalDate.now())
                .status("ISSUED")
                .pdfPath(savedFilePath)
                .build();

        OfferLetter saved = offerLetterRepository.save(letter);

        // Send email with attachment if requested
        if (sendEmail) {
            emailService.sendOfferLetterNotification(
                    student.getUser().getEmail(),
                    student.getUser().getFirstName(),
                    internship.getTitle(),
                    refNo,
                    savedFilePath
            );
        }

        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/offer-letters/{id}/upload-document")
    public ResponseEntity<OfferLetter> uploadOfferLetterDocument(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "sendEmail", required = false, defaultValue = "true") boolean sendEmail
    ) {
        OfferLetter letter = offerLetterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer letter not found with id: " + id));

        String savedPath = fileStorageService.saveOfferLetterFile(file, letter.getReferenceNumber());
        letter.setPdfPath(savedPath);
        OfferLetter saved = offerLetterRepository.save(letter);

        if (sendEmail) {
            emailService.sendOfferLetterNotification(
                    letter.getStudent().getUser().getEmail(),
                    letter.getStudent().getUser().getFirstName(),
                    letter.getInternship() != null ? letter.getInternship().getTitle() : letter.getRoleTitle(),
                    letter.getReferenceNumber(),
                    savedPath
            );
        }

        return ResponseEntity.ok(saved);
    }

    // Certificates Management
    @GetMapping("/certificates")
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        return ResponseEntity.ok(certificateRepository.findAllByOrderByIdDesc());
    }

    @PostMapping(value = "/certificates")
    public ResponseEntity<Certificate> issueCertificate(
            @RequestParam Long studentId,
            @RequestParam String type,
            @RequestParam String title,
            @RequestParam String domain,
            @RequestParam(required = false) String grade,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "sendEmail", required = false, defaultValue = "true") boolean sendEmail
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        boolean isCivil = "CIVIL".equalsIgnoreCase(domain);
        String prefix = isCivil ? "STATS-AN-2026-CIV" : "STATS-2026-CSE";
        String certNo = prefix + "-" + String.format("%04d", new Random().nextInt(9000) + 1000);
        String vCode = generateNextCertificateVerificationCode();

        String savedFilePath = null;
        if (file != null && !file.isEmpty()) {
            savedFilePath = fileStorageService.saveCertificateFile(file, certNo);
        }

        Certificate cert = Certificate.builder()
                .certificateNumber(certNo)
                .verificationCode(vCode)
                .student(student)
                .type(type)
                .title(title)
                .domain(domain.toUpperCase())
                .partnerName(isCivil ? "AN Survey Consultant" : null)
                .grade(grade != null ? grade : "Grade A+ (Distinction)")
                .issueDate(LocalDate.now())
                .status("VERIFIED")
                .pdfPath(savedFilePath)
                .build();

        Certificate saved = certificateRepository.save(cert);

        if (sendEmail) {
            emailService.sendCertificateNotification(
                    student.getUser().getEmail(),
                    student.getUser().getFirstName(),
                    title,
                    certNo,
                    savedFilePath
            );
        }

        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/certificates/{id}/upload-document")
    public ResponseEntity<Certificate> uploadCertificateDocument(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "sendEmail", required = false, defaultValue = "true") boolean sendEmail
    ) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with id: " + id));

        String savedPath = fileStorageService.saveCertificateFile(file, cert.getCertificateNumber());
        cert.setPdfPath(savedPath);
        Certificate saved = certificateRepository.save(cert);

        if (sendEmail) {
            emailService.sendCertificateNotification(
                    cert.getStudent().getUser().getEmail(),
                    cert.getStudent().getUser().getFirstName(),
                    cert.getTitle(),
                    cert.getCertificateNumber(),
                    savedPath
            );
        }

        return ResponseEntity.ok(saved);
    }

    // Support Queries Management
    @GetMapping("/queries")
    public ResponseEntity<List<SupportQuery>> getAllQueries() {
        return ResponseEntity.ok(queryService.getAllQueries());
    }

    @PostMapping("/queries/{id}/reply")
    public ResponseEntity<SupportQuery> replyQuery(
            @PathVariable Long id,
            @Valid @RequestBody QueryReplyRequest request
    ) {
        return ResponseEntity.ok(queryService.replyQuery(id, request));
    }

    // Partners Management
    @GetMapping("/partners")
    public ResponseEntity<List<IndustryPartner>> getAllPartners() {
        return ResponseEntity.ok(partnerRepository.findAll());
    }

    @PostMapping("/partners")
    public ResponseEntity<IndustryPartner> createPartner(@RequestBody IndustryPartner partner) {
        return ResponseEntity.ok(partnerRepository.save(partner));
    }

    @DeleteMapping("/partners/{id}")
    public ResponseEntity<Void> deletePartner(@PathVariable Long id) {
        partnerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Enrollments Management
    @GetMapping("/enrollments")
    public ResponseEntity<List<CourseEnrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAllByOrderByIdDesc());
    }

    @PatchMapping("/enrollments/{id}/status")
    public ResponseEntity<CourseEnrollment> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        CourseEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found with id: " + id));
        enrollment.setStatus(status.toUpperCase());
        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    // Contact Enquiries Management
    @GetMapping("/enquiries")
    public ResponseEntity<List<ContactMessage>> getAllEnquiries() {
        return ResponseEntity.ok(contactMessageRepository.findAll());
    }

    @PatchMapping("/enquiries/{id}/read")
    public ResponseEntity<ContactMessage> markEnquiryRead(@PathVariable Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Enquiry not found with id: " + id));
        msg.setRead(true);
        return ResponseEntity.ok(contactMessageRepository.save(msg));
    }

    @DeleteMapping("/enquiries/{id}")
    public ResponseEntity<Void> deleteEnquiry(@PathVariable Long id) {
        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Analytics Breakdown
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> data = new HashMap<>();

        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalInternships = internshipRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalApplications = applicationRepository.count();

        // Calculate Revenue from paid enrollments
        java.math.BigDecimal totalRevenue = enrollmentRepository.findAll().stream()
                .filter(e -> "PAID".equalsIgnoreCase(e.getPaymentStatus()) && e.getPaymentAmount() != null)
                .map(CourseEnrollment::getPaymentAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        // Application status breakdown
        Map<String, Long> appStatusCounts = new HashMap<>();
        for (InternshipApplication app : applicationRepository.findAll()) {
            String st = app.getStatus() != null ? app.getStatus() : "PENDING";
            appStatusCounts.put(st, appStatusCounts.getOrDefault(st, 0L) + 1);
        }

        // Enrollment status breakdown
        Map<String, Long> enrollmentStatusCounts = new HashMap<>();
        for (CourseEnrollment enr : enrollmentRepository.findAll()) {
            String st = enr.getStatus() != null ? enr.getStatus() : "ACTIVE";
            enrollmentStatusCounts.put(st, enrollmentStatusCounts.getOrDefault(st, 0L) + 1);
        }

        data.put("totalStudents", totalStudents);
        data.put("totalCourses", totalCourses);
        data.put("totalInternships", totalInternships);
        data.put("totalEnrollments", totalEnrollments);
        data.put("totalApplications", totalApplications);
        data.put("totalRevenue", totalRevenue);
        data.put("applicationStatusBreakdown", appStatusCounts);
        data.put("enrollmentStatusBreakdown", enrollmentStatusCounts);
        data.put("totalCertificates", certificateRepository.count());
        data.put("totalOfferLetters", offerLetterRepository.count());

        return ResponseEntity.ok(data);
    }
}
