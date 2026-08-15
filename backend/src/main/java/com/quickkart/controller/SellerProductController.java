package com.quickkart.controller;

import com.quickkart.entity.Product;
import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.entity.OrderItem;
import com.quickkart.repository.ProductRepository;
import com.quickkart.repository.UserRepository;
import com.quickkart.repository.OrderItemRepository;
import com.quickkart.repository.CategoryRepository;
import com.quickkart.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/products")
@CrossOrigin(origins = "*")
public class SellerProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private User getAuthenticatedSeller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.getRole() == Role.SELLER) {
            return user;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getSellerProducts() {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        List<Product> products = productRepository.findBySeller(seller);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getSellerAnalytics() {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        List<OrderItem> items = orderItemRepository.findBySeller(seller);
        
        BigDecimal totalSales = BigDecimal.ZERO;
        for (OrderItem item : items) {
            totalSales = totalSales.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Count unique orders
        long totalOrders = items.stream().map(item -> item.getOrder().getId()).distinct().count();
        
        // Count unique customers
        long totalCustomers = items.stream().map(item -> item.getOrder().getCustomer().getId()).distinct().count();

        return ResponseEntity.ok(Map.of(
            "totalSales", totalSales,
            "totalOrders", totalOrders,
            "totalCustomers", totalCustomers
        ));
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        if (product.getCategory() != null && product.getCategory().getName() != null) {
            String categoryName = product.getCategory().getName();
            Category category = categoryRepository.findByName(categoryName).orElseGet(() -> {
                Category newCat = new Category();
                newCat.setName(categoryName);
                return categoryRepository.save(newCat);
            });
            product.setCategory(category);
        }

        product.setSeller(seller);
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Not authorized or product not found");
        }

        existingProduct.setTitle(productDetails.getTitle());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setOriginalPrice(productDetails.getOriginalPrice());
        existingProduct.setDiscount(productDetails.getDiscount());
        existingProduct.setImageUrl(productDetails.getImageUrl());
        
        if (productDetails.getCategory() != null && productDetails.getCategory().getName() != null) {
            String categoryName = productDetails.getCategory().getName();
            Category category = categoryRepository.findByName(categoryName).orElseGet(() -> {
                Category newCat = new Category();
                newCat.setName(categoryName);
                return categoryRepository.save(newCat);
            });
            existingProduct.setCategory(category);
        }
        
        Product updatedProduct = productRepository.save(existingProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        User seller = getAuthenticatedSeller();
        if (seller == null) return ResponseEntity.status(403).body("Not authorized");

        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Not authorized or product not found");
        }

        productRepository.delete(existingProduct);
        return ResponseEntity.ok("Deleted successfully");
    }
}
