package com.statsinnotech.controller;

import com.statsinnotech.dto.CertificateVerificationResponse;
import com.statsinnotech.entity.Certificate;
import com.statsinnotech.entity.OfferLetter;
import com.statsinnotech.repository.CertificateRepository;
import com.statsinnotech.repository.OfferLetterRepository;
import com.statsinnotech.service.DocumentService;
import com.statsinnotech.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final DocumentService documentService;
    private final OfferLetterRepository offerLetterRepository;
    private final CertificateRepository certificateRepository;
    private final FileStorageService fileStorageService;

    @GetMapping("/verify/{code}")
    public ResponseEntity<CertificateVerificationResponse> verifyCertificate(@PathVariable String code) {
        return ResponseEntity.ok(documentService.verifyCertificate(code));
    }

    // ==================== OFFER LETTERS DOWNLOAD ====================

    /**
     * Primary download endpoint by numeric ID (guaranteed safe from URL slash issues).
     */
    @GetMapping("/offer-letters/{id}/download")
    public ResponseEntity<?> downloadOfferLetterById(@PathVariable Long id) {
        OfferLetter letter = offerLetterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer letter not found with id: " + id));

        return serveOfferLetterFile(letter);
    }

    /**
     * Download endpoint by reference number or verification code query param (?ref=SIT-OF-501 or ref=STATS/OL/...).
     */
    @GetMapping("/offer-letter/download")
    public ResponseEntity<?> downloadOfferLetterByRefQuery(@RequestParam("ref") String refNo) {
        String clean = refNo.trim().toUpperCase();
        OfferLetter letter = offerLetterRepository.findByVerificationCode(clean)
                .or(() -> offerLetterRepository.findByReferenceNumber(refNo))
                .or(() -> offerLetterRepository.findByReferenceNumber(clean))
                .orElseThrow(() -> new IllegalArgumentException("Offer letter not found with ref/code: " + refNo));

        return serveOfferLetterFile(letter);
    }

    /**
     * Direct offer letter download by verification code (e.g. /api/documents/offer-letter/SIT-OF-501/download).
     */
    @GetMapping("/offer-letter/{code}/download")
    public ResponseEntity<?> downloadOfferLetterByPath(@PathVariable String code) {
        String clean = code.trim().toUpperCase();
        OfferLetter letter = offerLetterRepository.findByVerificationCode(clean)
                .or(() -> offerLetterRepository.findByReferenceNumber(code))
                .orElseThrow(() -> new IllegalArgumentException("Offer letter not found with code: " + code));

        return serveOfferLetterFile(letter);
    }

    // ==================== CERTIFICATES DOWNLOAD ====================

    /**
     * Primary download endpoint by numeric ID (guaranteed safe).
     */
    @GetMapping("/certificates/{id}/download")
    public ResponseEntity<?> downloadCertificateById(@PathVariable Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with id: " + id));

        return serveCertificateFile(cert);
    }

    /**
     * Download endpoint by certificate number query param (?certNo=STATS-2026-CSE-1234).
     */
    @GetMapping("/certificate/download")
    public ResponseEntity<?> downloadCertificateByQuery(@RequestParam("certNo") String certNo) {
        String clean = certNo.trim().toUpperCase();
        Certificate cert = certificateRepository.findByCertificateNumber(clean)
                .or(() -> certificateRepository.findByVerificationCode(clean))
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with number/code: " + certNo));

        return serveCertificateFile(cert);
    }

    /**
     * Direct certificate download by path variable.
     */
    @GetMapping({"/certificate/{certNo}/pdf", "/certificate/{certNo}/download"})
    public ResponseEntity<?> downloadCertificateByPath(@PathVariable String certNo) {
        String clean = certNo.trim().toUpperCase();
        Certificate cert = certificateRepository.findByCertificateNumber(clean)
                .or(() -> certificateRepository.findByVerificationCode(clean))
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with number: " + certNo));

        return serveCertificateFile(cert);
    }

    // ==================== HELPER METHODS ====================

    private ResponseEntity<?> serveOfferLetterFile(OfferLetter letter) {
        if (letter.getPdfPath() == null || !fileStorageService.fileExists(letter.getPdfPath())) {
            log.warn("Offer letter {} has no manual file uploaded", letter.getReferenceNumber());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "NO_DOCUMENT_UPLOADED",
                            "message", "No document file has been uploaded for this offer letter yet. Please upload it in the Admin panel."
                    ));
        }

        try {
            byte[] bytes = fileStorageService.readFile(letter.getPdfPath());
            String contentType = fileStorageService.getContentType(letter.getPdfPath());
            String filename = Paths.get(letter.getPdfPath()).getFileName().toString();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(bytes);
        } catch (Exception ex) {
            log.error("Failed to read offer letter file: {}", letter.getPdfPath(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "FILE_READ_ERROR", "message", "Could not read the uploaded document: " + ex.getMessage()));
        }
    }

    private ResponseEntity<?> serveCertificateFile(Certificate cert) {
        if (cert.getPdfPath() == null || !fileStorageService.fileExists(cert.getPdfPath())) {
            log.warn("Certificate {} has no manual file uploaded", cert.getCertificateNumber());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "NO_DOCUMENT_UPLOADED",
                            "message", "No document file has been uploaded for this certificate yet. Please upload it in the Admin panel."
                    ));
        }

        try {
            byte[] bytes = fileStorageService.readFile(cert.getPdfPath());
            String contentType = fileStorageService.getContentType(cert.getPdfPath());
            String filename = Paths.get(cert.getPdfPath()).getFileName().toString();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(bytes);
        } catch (Exception ex) {
            log.error("Failed to read certificate file: {}", cert.getPdfPath(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "FILE_READ_ERROR", "message", "Could not read the uploaded document: " + ex.getMessage()));
        }
    }
}
