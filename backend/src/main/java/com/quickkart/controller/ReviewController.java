package com.quickkart.controller;

import com.quickkart.entity.Review;
import com.quickkart.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<Review> addProductReview(
            @PathVariable Long productId,
            @RequestBody Review review) {
        review.setProductId(productId);
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }
}
