package com.quickkart.controller;

import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "*")
public class SellerController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyToBeSeller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "User not found"));
        }

        if (user.getRole() == Role.SELLER) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Already a seller"));
        }

        user.setRole(Role.PENDING_SELLER);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
