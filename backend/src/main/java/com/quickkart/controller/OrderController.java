package com.quickkart.controller;

import com.quickkart.entity.Order;
import com.quickkart.entity.OrderItem;
import com.quickkart.entity.Product;
import com.quickkart.entity.User;
import com.quickkart.repository.OrderItemRepository;
import com.quickkart.repository.OrderRepository;
import com.quickkart.repository.ProductRepository;
import com.quickkart.repository.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Value("${razorpay.key.id:dummy_key_id}")
    private String keyId;

    @Value("${razorpay.key.secret:dummy_key_secret}")
    private String keySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            // Amount in paise (1 INR = 100 paise)
            int amount = (int) data.get("amount") * 100;
            
            // For testing purposes, if keys are dummy, return a mock response
            if (keyId.equals("dummy_key_id") || keyId.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "id", "order_mock_" + System.currentTimeMillis(),
                    "currency", "INR",
                    "amount", amount,
                    "status", "created"
                ));
            }

            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            com.razorpay.Order order = razorpayClient.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestBody Map<String, Object> payload) {
        User customer = getAuthenticatedUser();
        if (customer == null) return ResponseEntity.status(403).body("Not authorized");

        try {
            String paymentId = (String) payload.get("paymentId");
            Number amountRaw = (Number) payload.get("amount");
            BigDecimal amount = BigDecimal.valueOf(amountRaw.doubleValue());
            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

            Order order = new Order();
            order.setCustomer(customer);
            order.setTotalAmount(amount);
            order.setStatus("CONFIRMED");
            order.setPaymentId(paymentId);
            
            Order savedOrder = orderRepository.save(order);
            List<OrderItem> orderItems = new ArrayList<>();

            for (Map<String, Object> itemData : items) {
                Long productId = Long.valueOf(itemData.get("id").toString());
                Integer quantity = (Integer) itemData.get("quantity");
                
                Product product = productRepository.findById(productId).orElse(null);
                if (product != null) {
                    OrderItem item = new OrderItem();
                    item.setOrder(savedOrder);
                    item.setProduct(product);
                    item.setSeller(product.getSeller());
                    item.setQuantity(quantity);
                    item.setPrice(product.getPrice());
                    orderItems.add(item);
                }
            }

            orderItemRepository.saveAll(orderItems);
            savedOrder.setItems(orderItems);

            return ResponseEntity.ok(Map.of("message", "Order confirmed successfully", "orderId", savedOrder.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to confirm order: " + e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders() {
        User customer = getAuthenticatedUser();
        if (customer == null) return ResponseEntity.status(403).body("Not authorized");

        List<Order> orders = orderRepository.findByCustomerOrderByCreatedAtDesc(customer);
        return ResponseEntity.ok(orders);
    }
}
