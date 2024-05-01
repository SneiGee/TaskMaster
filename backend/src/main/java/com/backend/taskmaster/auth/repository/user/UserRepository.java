package com.backend.taskmaster.auth.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.taskmaster.auth.entities.User;
   
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String username);
}
