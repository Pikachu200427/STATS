package com.statsinnotech.controller;

import com.statsinnotech.dto.InternshipApplicationRequest;
import com.statsinnotech.entity.Internship;
import com.statsinnotech.entity.InternshipApplication;
import com.statsinnotech.service.InternshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipService internshipService;
    private final com.statsinnotech.service.FileStorageService fileStorageService;

    @PostMapping(value = "/upload-resume", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Please select a resume file to upload"));
        }
        String originalFilename = file.getOriginalFilename();
        String savedPath = fileStorageService.saveResumeFile(file, "applicant");
        String filename = java.nio.file.Paths.get(savedPath).getFileName().toString();
        String publicUrl = "/api/documents/resumes/" + filename;
        return ResponseEntity.ok(java.util.Map.of(
                "url", publicUrl,
                "filename", filename,
                "originalName", originalFilename != null ? originalFilename : filename
        ));
    }

    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships(
            @RequestParam(required = false) String domain
    ) {
        if (domain != null && !domain.isBlank()) {
            return ResponseEntity.ok(internshipService.getInternshipsByDomain(domain));
        }
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Internship> getInternshipBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(internshipService.getInternshipBySlug(slug));
    }

    @PostMapping("/apply")
    public ResponseEntity<InternshipApplication> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InternshipApplicationRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        InternshipApplication app = internshipService.apply(userDetails.getUsername(), request);
        return ResponseEntity.ok(app);
    }
}
