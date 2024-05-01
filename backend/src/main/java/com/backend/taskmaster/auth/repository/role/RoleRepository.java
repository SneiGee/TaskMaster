package com.backend.taskmaster.auth.repository.role;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.taskmaster.auth.entities.Role;
import com.backend.taskmaster.auth.entities.RoleEnum;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleEnum role);
}
