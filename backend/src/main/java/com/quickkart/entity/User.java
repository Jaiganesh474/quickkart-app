package com.quickkart.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;
}
