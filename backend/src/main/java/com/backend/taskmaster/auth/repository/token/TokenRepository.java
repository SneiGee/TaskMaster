package com.backend.taskmaster.auth.repository.token;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.taskmaster.auth.entities.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
}
