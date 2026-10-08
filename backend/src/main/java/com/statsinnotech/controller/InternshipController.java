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
