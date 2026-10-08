package com.statsinnotech.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("support@statsinnotech.in");
                message.setTo(toEmail);
                message.setSubject("Welcome to STATS INNOTECH — Your Career Launchpad!");
                message.setText("Dear " + firstName + ",\n\n" +
                        "Welcome to STATS INNOTECH!\n\n" +
                        "Your student profile has been created. You can now enroll in technical courses, " +
                        "apply for industry-led CSE & Civil Engineering internships, and access study kits.\n\n" +
                        "Access your portal: http://localhost:5173/portal\n\n" +
                        "Best regards,\n" +
                        "Academic Team\n" +
                        "STATS INNOTECH Pvt. Ltd.");

                mailSender.send(message);
                log.info("Welcome email successfully sent to {}", toEmail);
            } catch (Exception ex) {
                log.warn("Could not dispatch welcome email to {} (SMTP not configured for local dev): {}", toEmail, ex.getMessage());
            }
        });
    }

    @Async
    public void sendEnrollmentConfirmation(String toEmail, String studentName, String courseTitle, String enrollmentId) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("support@statsinnotech.in");
                message.setTo(toEmail);
                message.setSubject("Enrollment Confirmed: " + courseTitle + " [" + enrollmentId + "]");
                message.setText("Dear " + studentName + ",\n\n" +
                        "Your enrollment in '" + courseTitle + "' is confirmed!\n\n" +
                        "Enrollment Reference ID: " + enrollmentId + "\n\n" +
                        "You can access the lectures, batch schedule, and assignments directly from your Student Portal:\n" +
                        "http://localhost:5173/portal/courses\n\n" +
                        "Happy learning!\n" +
                        "STATS INNOTECH Team");

                mailSender.send(message);
                log.info("Enrollment email sent to {}", toEmail);
            } catch (Exception ex) {
                log.warn("Could not send enrollment confirmation email to {}: {}", toEmail, ex.getMessage());
            }
        });
    }

    @Async
    public void sendOfferLetterNotification(String toEmail, String studentName, String trackTitle, String refNo) {
        sendOfferLetterNotification(toEmail, studentName, trackTitle, refNo, null);
    }

    @Async
    public void sendOfferLetterNotification(String toEmail, String studentName, String trackTitle, String refNo, String filePath) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper =
                        new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom("support@statsinnotech.in");
                helper.setTo(toEmail);
                helper.setSubject("Congratulations! Internship Offer Letter: " + trackTitle + " [" + refNo + "]");

                String body = "Dear " + studentName + ",\n\n" +
                        "Congratulations! We are pleased to welcome you to STATS INNOTECH for the internship program: " + trackTitle + ".\n\n" +
                        "Offer Letter Reference: " + refNo + "\n\n" +
                        "Your official signed offer letter is attached to this email and is also accessible on your Student Portal:\n" +
                        "http://localhost:5173/portal/offer-letters\n\n" +
                        "Please review your offer details and reporting guidelines.\n\n" +
                        "Welcome aboard!\n" +
                        "Human Resources & Technical Committee\n" +
                        "STATS INNOTECH Pvt. Ltd.\n" +
                        "+91 92844 24561 | info@statsinnotech.org | www.statsinnotech.org";

                helper.setText(body);

                if (filePath != null && !filePath.isBlank()) {
                    java.io.File attachment = new java.io.File(filePath);
                    if (attachment.exists() && attachment.length() > 0) {
                        helper.addAttachment(attachment.getName(), attachment);
                    }
                }

                mailSender.send(mimeMessage);
                log.info("Offer letter email (with attachment: {}) sent to {}", filePath != null, toEmail);
            } catch (Exception ex) {
                log.warn("Could not send offer letter email to {}: {}", toEmail, ex.getMessage());
            }
        });
    }

    @Async
    public void sendCertificateNotification(String toEmail, String studentName, String programTitle, String certNo) {
        sendCertificateNotification(toEmail, studentName, programTitle, certNo, null);
    }

    @Async
    public void sendCertificateNotification(String toEmail, String studentName, String programTitle, String certNo, String filePath) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper =
                        new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom("support@statsinnotech.in");
                helper.setTo(toEmail);
                helper.setSubject("Certificate Issued: " + programTitle + " [" + certNo + "]");

                String body = "Dear " + studentName + ",\n\n" +
                        "Congratulations on successfully completing your program: " + programTitle + "!\n\n" +
                        "Your official Certificate of Internship has been issued.\n" +
                        "Certificate ID: " + certNo + "\n\n" +
                        "Your certificate document is attached to this email and is permanently verifiable and downloadable on your Student Portal:\n" +
                        "http://localhost:5173/portal/certificates\n\n" +
                        "Public Verification URL:\n" +
                        "http://localhost:5173/verify-certificate?id=" + certNo + "\n\n" +
                        "We wish you immense success in your engineering career!\n\n" +
                        "Academic & Certification Board\n" +
                        "STATS INNOTECH Pvt. Ltd.\n" +
                        "+91 92844 24561 | info@statsinnotech.org | www.statsinnotech.org";

                helper.setText(body);

                if (filePath != null && !filePath.isBlank()) {
                    java.io.File attachment = new java.io.File(filePath);
                    if (attachment.exists() && attachment.length() > 0) {
                        helper.addAttachment(attachment.getName(), attachment);
                    }
                }

                mailSender.send(mimeMessage);
                log.info("Certificate email (with attachment: {}) sent to {}", filePath != null, toEmail);
            } catch (Exception ex) {
                log.warn("Could not send certificate email to {}: {}", toEmail, ex.getMessage());
            }
        });
    }

    @Async
    public void sendQueryReplyNotification(String toEmail, String studentName, String subject, String reply) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("support@statsinnotech.in");
                message.setTo(toEmail);
                message.setSubject("Update on Support Ticket: " + subject);
                message.setText("Dear " + studentName + ",\n\n" +
                        "An instructor / administrator has replied to your query:\n\n" +
                        "\"" + reply + "\"\n\n" +
                        "View complete thread in the Student Portal: http://localhost:5173/portal/queries\n\n" +
                        "Best regards,\n" +
                        "Student Support\n" +
                        "STATS INNOTECH");

                mailSender.send(message);
                log.info("Query reply email sent to {}", toEmail);
            } catch (Exception ex) {
                log.warn("Could not send query reply email to {}: {}", toEmail, ex.getMessage());
            }
        });
    }
}
