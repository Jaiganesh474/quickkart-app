package com.quickkart.controller;

import com.quickkart.entity.Category;
import com.quickkart.entity.Product;
import com.quickkart.entity.Role;
import com.quickkart.entity.User;
import com.quickkart.repository.CategoryRepository;
import com.quickkart.repository.ProductRepository;
import com.quickkart.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Arrays;

@RestController
@RequestMapping("/api/seed")
@CrossOrigin(origins = "*")
public class SeedController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Data
    public static class FakeStoreProduct {
        private Long id;
        private String title;
        private Double price;
        private String description;
        private String category;
        private String image;
    }

    @PostMapping("/fakestore")
    public ResponseEntity<?> seedFakeStore() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            FakeStoreProduct[] apiProducts = restTemplate.getForObject("https://fakestoreapi.com/products", FakeStoreProduct[].class);

            if (apiProducts == null || apiProducts.length == 0) {
                return ResponseEntity.badRequest().body("Failed to fetch products from FakeStore API");
            }

            // Get or create dummy seller
            User seller = userRepository.findByEmail("fakestore@quickkart.com").orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail("fakestore@quickkart.com");
                newUser.setName("FakeStore Retail");
                newUser.setPassword(passwordEncoder.encode("password123"));
                newUser.setRole(Role.SELLER);
                return userRepository.save(newUser);
            });

            int addedCount = 0;

            for (FakeStoreProduct fakeProduct : apiProducts) {
                if (productRepository.findByTitle(fakeProduct.getTitle()).isPresent()) {
                    continue; // Skip existing
                }

                String catName = fakeProduct.getCategory().substring(0, 1).toUpperCase() + fakeProduct.getCategory().substring(1);
                
                Category category = categoryRepository.findByName(catName).orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(catName);
                    newCat.setIconUrl(fakeProduct.getImage()); 
                    return categoryRepository.save(newCat);
                });

                Product product = new Product();
                product.setTitle(fakeProduct.getTitle());
                product.setDescription(fakeProduct.getDescription());
                
                // Simulate INR
                BigDecimal basePrice = BigDecimal.valueOf(fakeProduct.getPrice() * 80);
                product.setPrice(basePrice);
                product.setOriginalPrice(basePrice.multiply(BigDecimal.valueOf(1.25)));
                product.setDiscount("20% OFF");
                
                product.setImageUrl(fakeProduct.getImage());
                product.setImages(Arrays.asList(fakeProduct.getImage()));
                
                product.setCategory(category);
                product.setSeller(seller);

                productRepository.save(product);
                addedCount++;
            }

            return ResponseEntity.ok("Successfully seeded " + addedCount + " products from FakeStore API!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error seeding products: " + e.getMessage());
        }
    }
    
    @PostMapping("/custom")
    public ResponseEntity<?> seedCustom() {
        try {
            User seller = userRepository.findByEmail("fakestore@quickkart.com").orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail("fakestore@quickkart.com");
                newUser.setName("FakeStore Retail");
                newUser.setPassword(passwordEncoder.encode("password123"));
                newUser.setRole(Role.SELLER);
                return userRepository.save(newUser);
            });

            String[][] mockData = {
                // Batch 1
                {"Fashion", "Premium Cotton T-Shirt", "Comfortable, breathable cotton t-shirt for daily wear.", "499", "fashion"},
                {"Mobiles", "Galaxy S24 Ultra", "Latest flagship smartphone with AI capabilities.", "129999", "smartphone"},
                {"Appliances", "Smart Inverter Refrigerator", "Double door 500L refrigerator with frost-free cooling.", "45000", "refrigerator"},
                {"Electronics", "Noise Cancelling Headphones", "Over-ear wireless headphones with ANC.", "2999", "headphones"},
                {"Smart Gadgets", "Fitness Smartwatch Pro", "Heart rate, SpO2 monitor, and 14 days battery.", "1999", "smartwatch"},
                {"Home", "Luxury Bed Sheet Set", "400 thread count Egyptian cotton bedsheets.", "1499", "bedsheet"},
                {"Beauty & Personal Care", "Organic Face Wash", "Sulfate-free face wash with aloe vera extract.", "399", "skincare"},
                {"Toys & Baby Care", "Building Blocks Set", "100-piece colorful building block set for kids.", "799", "toys"},
                {"Food & Healthcare", "Premium Whey Protein", "1kg Whey Protein Isolate, Chocolate flavor.", "2499", "protein"},
                {"Auto Accessories", "Car Dashboard Camera", "1080p HD dashcam with night vision.", "3499", "dashcam"},
                {"Sports & Fitness", "Yoga Mat with Strap", "Non-slip 6mm thick yoga mat.", "599", "yoga"},
                {"Furniture", "Ergonomic Office Chair", "Adjustable lumbar support and mesh back.", "5999", "officechair"},
                {"Books & Media", "Atomic Habits Book", "Bestselling book on building good habits.", "299", "book"},
                {"2 Wheelers", "Electric Scooter E1", "Eco-friendly scooter with 80km range.", "85000", "scooter"},
                
                // Batch 2
                {"Fashion", "Men's Denim Jacket", "Classic blue denim jacket with brass buttons.", "1299", "denim"},
                {"Mobiles", "iPhone 15 Pro Max", "Titanium design, A17 Pro chip.", "159900", "iphone"},
                {"Appliances", "Fully Automatic Washing Machine", "7kg front load washer with inverter motor.", "28500", "washingmachine"},
                {"Electronics", "4K Ultra HD Smart TV", "55-inch 4K LED Smart Android TV.", "41999", "tv"},
                {"Smart Gadgets", "Smart Home Security Camera", "360-degree 1080p WiFi security camera.", "2499", "camera"},
                {"Home", "Aromatherapy Diffuser", "Essential oil diffuser with LED lights.", "899", "diffuser"},
                {"Beauty & Personal Care", "Vitamin C Face Serum", "Brightening serum for glowing skin.", "599", "serum"},
                {"Toys & Baby Care", "Remote Control Car", "High-speed off-road RC car for kids.", "1199", "rccar"},
                {"Food & Healthcare", "Organic Green Tea", "100 bags of pure organic green tea.", "349", "greentea"},
                {"Auto Accessories", "Universal Car Seat Covers", "Premium leatherette seat covers.", "4500", "carseat"},
                {"Sports & Fitness", "Adjustable Dumbbells Set", "20kg adjustable dumbbells for home gym.", "3299", "dumbbells"},
                {"Furniture", "Solid Wood Dining Table", "6-seater oak wood dining table set.", "24000", "diningtable"},
                {"Books & Media", "The Psychology of Money", "Timeless lessons on wealth and happiness.", "350", "book"},
                {"2 Wheelers", "Premium Riding Helmet", "DOT certified full face helmet.", "2999", "helmet"}
            };

            int addedCount = 0;

            for (String[] data : mockData) {
                String catName = data[0];
                String title = data[1];
                String desc = data[2];
                BigDecimal price = new BigDecimal(data[3]);
                String keyword = data[4];
                String imageUrl = "https://loremflickr.com/400/400/" + keyword;

                if (productRepository.findByTitle(title).isPresent()) {
                    continue; // Skip existing
                }

                Category category = categoryRepository.findByName(catName).orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(catName);
                    newCat.setIconUrl(imageUrl);
                    return categoryRepository.save(newCat);
                });

                Product product = new Product();
                product.setTitle(title);
                product.setDescription(desc);
                product.setPrice(price);
                product.setOriginalPrice(price.multiply(BigDecimal.valueOf(1.25))); // 20% mock markup
                product.setDiscount("20% OFF");
                product.setImageUrl(imageUrl);
                product.setImages(Arrays.asList(imageUrl, imageUrl)); // Two images for the slider
                product.setCategory(category);
                product.setSeller(seller);

                productRepository.save(product);
                addedCount++;
            }

            return ResponseEntity.ok("Successfully seeded " + addedCount + " custom products across all categories!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error seeding products: " + e.getMessage());
        }
    }
}
