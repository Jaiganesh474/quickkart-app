package com.quickkart.repository;

import com.quickkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.quickkart.entity.Role;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
