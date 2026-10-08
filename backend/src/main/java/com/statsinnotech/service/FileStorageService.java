package com.statsinnotech.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Slf4j
public class FileStorageService {

    @Value("${stats.storage.uploads-dir:./data/uploads}")
    private String uploadsBaseDir;

    private Path offerLettersDir;
    private Path certificatesDir;

    @PostConstruct
    public void init() {
        try {
            offerLettersDir = Paths.get(uploadsBaseDir, "offer-letters").toAbsolutePath().normalize();
            certificatesDir = Paths.get(uploadsBaseDir, "certificates").toAbsolutePath().normalize();

            Files.createDirectories(offerLettersDir);
            Files.createDirectories(certificatesDir);

            log.info("Initialized document storage directories:\nOffer Letters: {}\nCertificates: {}",
                    offerLettersDir, certificatesDir);
        } catch (IOException e) {
            log.error("Failed to initialize document upload directories", e);
            throw new RuntimeException("Could not create upload directories: " + e.getMessage(), e);
        }
    }

    public String saveOfferLetterFile(MultipartFile file, String refNo) {
        return saveFile(file, offerLettersDir, "ol_" + sanitizeIdentifier(refNo));
    }

    public String saveCertificateFile(MultipartFile file, String certNo) {
        return saveFile(file, certificatesDir, "cert_" + sanitizeIdentifier(certNo));
    }

    private String saveFile(MultipartFile file, Path targetDir, String prefix) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".pdf";
        }

        String safeFilename = prefix + "_" + System.currentTimeMillis() + extension;
        Path targetPath = targetDir.resolve(safeFilename);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Saved manual document to: {}", targetPath);
            return targetPath.toString();
        } catch (IOException e) {
            log.error("Failed to save uploaded file: {}", targetPath, e);
            throw new RuntimeException("Failed to save uploaded document: " + e.getMessage(), e);
        }
    }

    public boolean fileExists(String filePath) {
        if (filePath == null || filePath.isBlank()) return false;
        return Files.exists(Paths.get(filePath));
    }

    public byte[] readFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        return Files.readAllBytes(path);
    }

    public String getContentType(String filePath) {
        try {
            Path path = Paths.get(filePath);
            String ct = Files.probeContentType(path);
            if (ct != null) return ct;
        } catch (Exception ignored) {}

        String lower = filePath.toLowerCase();
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }

    private String sanitizeIdentifier(String id) {
        if (id == null) return "doc";
        return id.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}
