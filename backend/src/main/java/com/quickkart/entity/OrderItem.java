package com.quickkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties("items")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    private Integer quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private String status = "PENDING"; // PENDING, SHIPPED, DELIVERED, CANCELLED
}

