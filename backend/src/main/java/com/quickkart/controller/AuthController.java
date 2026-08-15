package com.quickkart.controller;

import com.quickkart.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.register(
                    payload.get("email"),
                    payload.get("password"),
                    payload.getOrDefault("name", "User"),
                    payload.get("otp")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegistrationOtp(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.sendRegistrationOtp(payload.get("email")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendForgotPasswordOtp(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.sendForgotPasswordOtp(payload.get("email")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.resetPassword(
                    payload.get("email"),
                    payload.get("otp"),
                    payload.get("newPassword")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.login(
                    payload.get("email"),
                    payload.get("password")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.generateAndSendOtp(payload.get("email")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(authService.verifyOtp(
                    payload.get("email"),
                    payload.get("otp")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
