package com.quickkart.repository;

import com.quickkart.entity.OrderItem;
import com.quickkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findBySeller(User seller);
}
