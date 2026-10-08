package com.statsinnotech.controller;

import com.statsinnotech.dto.ContactMessageRequest;
import com.statsinnotech.entity.ContactMessage;
import com.statsinnotech.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactMessage> submitContact(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.ok(contactService.saveMessage(request));
    }
}
