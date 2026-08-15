package com.quickkart.repository;

import com.quickkart.entity.Product;
import com.quickkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryNameIgnoreCase(String categoryName);
    List<Product> findBySeller(User seller);
    java.util.Optional<Product> findByTitle(String title);
}
