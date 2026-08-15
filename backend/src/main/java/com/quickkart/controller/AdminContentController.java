package com.quickkart.controller;

import com.quickkart.entity.Banner;
import com.quickkart.entity.Category;
import com.quickkart.repository.BannerRepository;
import com.quickkart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class AdminContentController {

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- Banners ---

    @GetMapping("/banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerRepository.findAll());
    }

    @GetMapping("/banners/active")
    public ResponseEntity<List<Banner>> getActiveBanners() {
        return ResponseEntity.ok(bannerRepository.findByActiveTrue());
    }

    @PostMapping("/banners")
    public ResponseEntity<Banner> createBanner(@RequestBody Banner banner) {
        return ResponseEntity.ok(bannerRepository.save(banner));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        if (!bannerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bannerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Categories ---

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
