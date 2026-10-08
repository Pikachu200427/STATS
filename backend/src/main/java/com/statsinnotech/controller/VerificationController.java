package com.statsinnotech.controller;

import com.statsinnotech.dto.CertificateVerificationResponse;
import com.statsinnotech.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<CertificateVerificationResponse> verify(@RequestParam String query) {
        return ResponseEntity.ok(documentService.verifyCertificate(query));
    }
}
