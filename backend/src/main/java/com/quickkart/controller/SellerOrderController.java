package com.quickkart.controller;

import com.quickkart.entity.OrderItem;
import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.repository.OrderItemRepository;
import com.quickkart.repository.UserRepository;
import com.quickkart.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/orders")
@CrossOrigin(origins = "*")
public class SellerOrderController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private User getAuthenticatedSeller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.getRole() == Role.SELLER) {
            return user;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getSellerOrders() {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        List<OrderItem> items = orderItemRepository.findBySeller(seller);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{itemId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long itemId, @RequestBody Map<String, String> payload) {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        String newStatus = payload.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        OrderItem item = orderItemRepository.findById(itemId).orElse(null);
        if (item == null || !item.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(404).body("Order item not found or not authorized");
        }

        item.setStatus(newStatus);
        orderItemRepository.save(item);

        // Send Email
        User customer = item.getOrder().getCustomer();
        emailService.sendOrderStatusEmail(customer.getEmail(), customer.getName(), item.getProduct().getTitle(), newStatus);

        // Broadcast to WebSocket
        messagingTemplate.convertAndSend("/topic/orders/" + customer.getId(), item);

        return ResponseEntity.ok(item);
    }
}
