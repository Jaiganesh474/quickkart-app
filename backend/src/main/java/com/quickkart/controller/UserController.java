package com.quickkart.controller;

import com.quickkart.entity.User;
import com.quickkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        if (payload.containsKey("name")) {
            user.setName(payload.get("name"));
        }
        if (payload.containsKey("phone")) {
            user.setPhone(payload.get("phone"));
        }
        if (payload.containsKey("profilePicture")) {
            user.setProfilePicture(payload.get("profilePicture"));
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
