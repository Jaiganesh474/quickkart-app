package com.quickkart.service;

import com.quickkart.entity.Product;
import com.quickkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<Product> allProducts = productRepository.findAll();
        String[] tokens = query.toLowerCase().split("\\s+");

        List<ProductScore> scoredProducts = new ArrayList<>();

        for (Product product : allProducts) {
            int score = calculateScore(product, tokens, query.toLowerCase());
            if (score > 0) {
                scoredProducts.add(new ProductScore(product, score));
            }
        }

        // Sort by score descending
        scoredProducts.sort((a, b) -> Integer.compare(b.score, a.score));

        return scoredProducts.stream()
                .map(ps -> ps.product)
                .collect(Collectors.toList());
    }

    private int calculateScore(Product product, String[] tokens, String fullQuery) {
        int score = 0;
        String title = product.getTitle() != null ? product.getTitle().toLowerCase() : "";
        String description = product.getDescription() != null ? product.getDescription().toLowerCase() : "";
        String category = (product.getCategory() != null && product.getCategory().getName() != null) 
                ? product.getCategory().getName().toLowerCase() : "";

        // Exact match in title gives massive boost
        if (title.equals(fullQuery)) {
            score += 200;
        } else if (title.contains(fullQuery)) {
            score += 100;
        }

        // Token based scoring
        for (String token : tokens) {
            if (token.length() <= 1) continue; // Skip single characters

            // Title match
            if (title.contains(token)) {
                score += 50;
            }
            
            // Category match
            if (category.contains(token)) {
                score += 30;
            }
            
            // Description match
            if (description.contains(token)) {
                score += 10;
            }
        }

        return score;
    }

    private static class ProductScore {
        Product product;
        int score;

        ProductScore(Product product, int score) {
            this.product = product;
            this.score = score;
        }
    }
}
