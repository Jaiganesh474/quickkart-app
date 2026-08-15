package com.quickkart.controller;

import com.quickkart.entity.Product;
import com.quickkart.repository.ProductRepository;
import com.quickkart.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductRepository productRepository;
    private final SearchService searchService;
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("q") String query) {
        return searchService.searchProducts(query);
    }
    
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
