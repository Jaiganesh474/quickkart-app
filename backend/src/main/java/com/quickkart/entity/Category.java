package com.quickkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String iconUrl;
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
