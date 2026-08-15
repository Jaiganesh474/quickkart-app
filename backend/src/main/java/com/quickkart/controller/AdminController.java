package com.quickkart.controller;

import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/sellers/pending")
    public ResponseEntity<List<User>> getPendingSellers() {
        // Ideally secured to only ADMIN
        List<User> pendingSellers = userRepository.findByRole(Role.PENDING_SELLER);
        return ResponseEntity.ok(pendingSellers);
    }

    @PostMapping("/sellers/approve/{id}")
    public ResponseEntity<?> approveSeller(@PathVariable Long id) {
        // Ideally secured to only ADMIN
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        
        user.setRole(Role.SELLER);
        userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
}
