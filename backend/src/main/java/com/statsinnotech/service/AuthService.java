package com.statsinnotech.service;

import com.statsinnotech.dto.AuthResponse;
import com.statsinnotech.dto.LoginRequest;
import com.statsinnotech.dto.RegisterRequest;
import com.statsinnotech.entity.Role;
import com.statsinnotech.entity.Student;
import com.statsinnotech.entity.User;
import com.statsinnotech.repository.StudentRepository;
import com.statsinnotech.repository.UserRepository;
import com.statsinnotech.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phone(request.getPhone())
                .role(Role.STUDENT)
                .isEmailVerified(true)
                .build();

        User savedUser = userRepository.save(user);

        // Generate student profile
        String studentId = "STATS-STU-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Student student = Student.builder()
                .studentId(studentId)
                .user(savedUser)
                .college(request.getCollege())
                .degree(request.getDegree())
                .branch(request.getBranch())
                .graduationYear(request.getGraduationYear())
                .phone(request.getPhone())
                .build();

        studentRepository.save(student);

        // Authenticate and issue token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        // Send welcome email async
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole().name())
                .studentId(studentId)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String studentId = null;
        if (user.getRole() == Role.STUDENT) {
            studentId = studentRepository.findByUser(user)
                    .map(Student::getStudentId)
                    .orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .studentId(studentId)
                .build();
    }
}
