package com.statsinnotech.service;

import com.statsinnotech.dto.ContactMessageRequest;
import com.statsinnotech.entity.ContactMessage;
import com.statsinnotech.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository messageRepository;

    @Transactional
    public ContactMessage saveMessage(ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .isRead(false)
                .build();

        return messageRepository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return messageRepository.findAll();
    }
}
