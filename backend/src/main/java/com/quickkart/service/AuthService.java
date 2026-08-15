package com.quickkart.service;

import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.repository.UserRepository;
import com.quickkart.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${quickkart.mail.sender}")
    private String senderEmail;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Mock OTP storage (In production, use Redis or DB with expiration)
    private Map<String, String> otpStorage = new HashMap<>();

    public Map<String, Object> register(String email, String password, String name, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        otpStorage.remove(email);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        
        if ("admin@quickkart.com".equalsIgnoreCase(email)) {
            user.setRole(Role.ADMIN);
        }
        
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return Map.of("token", token, "message", "Registered successfully", "user", user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if ("admin@quickkart.com".equalsIgnoreCase(email) && user.getRole() != Role.ADMIN) {
            user.setRole(Role.ADMIN);
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return Map.of("token", token, "message", "Login successful", "user", user);
    }

    public Map<String, String> generateAndSendOtp(String email) {
        // Find or create user if needed. For now, let's just create if not exists or allow OTP for anyone.
        // Actually, OTP is a form of login/register.
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(generateRandomString(10))); // Random password for OTP users
            
            if ("admin@quickkart.com".equalsIgnoreCase(email)) {
                user.setRole(Role.ADMIN);
            }
            
            userRepository.save(user);
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);

        // MOCK EMAIL SENDING LOG (Keeping this for debugging)
        System.out.println("\n\n==========================================");
        System.out.println("BREVO OTP GENERATED FOR: " + email);
        System.out.println("YOUR OTP IS: " + otp);
        System.out.println("==========================================\n\n");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(email);
            message.setSubject("Your QuickKart Login OTP");
            message.setText("Welcome to QuickKart!\n\nYour One-Time Password (OTP) for login is: " + otp + "\n\nThis code will expire shortly. Do not share it with anyone.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email via Brevo: " + e.getMessage());
        }

        return Map.of("message", "OTP sent successfully to " + email);
    }

    public Map<String, String> sendRegistrationOtp(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered. Please log in.");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);

        System.out.println("\n\n==========================================");
        System.out.println("REGISTRATION OTP FOR: " + email);
        System.out.println("YOUR OTP IS: " + otp);
        System.out.println("==========================================\n\n");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(email);
            message.setSubject("Your QuickKart Registration OTP");
            message.setText("Welcome to QuickKart!\n\nYour One-Time Password (OTP) for registration is: " + otp + "\n\nThis code will expire shortly. Do not share it with anyone.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email via Brevo: " + e.getMessage());
        }

        return Map.of("message", "OTP sent successfully to " + email);
    }

    public Map<String, String> sendForgotPasswordOtp(String email) {
        if (!userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("No account found with that email address.");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, otp);

        System.out.println("\n\n==========================================");
        System.out.println("FORGOT PASSWORD OTP FOR: " + email);
        System.out.println("YOUR OTP IS: " + otp);
        System.out.println("==========================================\n\n");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(email);
            message.setSubject("Your QuickKart Password Reset OTP");
            message.setText("We received a request to reset your password.\n\nYour One-Time Password (OTP) is: " + otp + "\n\nIf you did not request this, please ignore this email.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email via Brevo: " + e.getMessage());
        }

        return Map.of("message", "Password reset OTP sent successfully to " + email);
    }

    public Map<String, Object> resetPassword(String email, String otp, String newPassword) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        otpStorage.remove(email);

        return Map.of("message", "Password reset successfully");
    }

    public Map<String, Object> verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clear OTP after successful use
        otpStorage.remove(email);
        
        if ("admin@quickkart.com".equalsIgnoreCase(email) && user.getRole() != Role.ADMIN) {
            user.setRole(Role.ADMIN);
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return Map.of("token", token, "message", "OTP verified successfully", "user", user);
    }

    private String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder result = new StringBuilder();
        Random rnd = new Random();
        while (result.length() < length) {
            result.append(characters.charAt((int) (rnd.nextFloat() * characters.length())));
        }
        return result.toString();
    }
}
