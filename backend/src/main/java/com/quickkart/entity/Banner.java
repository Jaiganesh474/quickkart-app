package com.quickkart.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(nullable = false, length = 1024)
    private String imageUrl;
    
    private boolean active = true;
}
