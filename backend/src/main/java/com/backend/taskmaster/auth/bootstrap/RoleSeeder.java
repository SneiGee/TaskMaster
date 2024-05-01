package com.backend.taskmaster.auth.bootstrap;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.backend.taskmaster.auth.entities.Role;
import com.backend.taskmaster.auth.entities.RoleEnum;
import com.backend.taskmaster.auth.repository.role.RoleRepository;

@Component
@Order(1)
public class RoleSeeder implements ApplicationListener<ContextRefreshedEvent> {
    private static final Logger logger = LogManager.getLogger(RoleSeeder.class);
    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        try {
            loadRoles();
        } catch (Exception e) {
            logger.error("Failed to seed roles", e);
        }
    }

    private void loadRoles() {
        RoleEnum[] roleNames = new RoleEnum[] { RoleEnum.STAFF, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN };
        Map<RoleEnum, String> roleDescriptionMap = Map.of(
            RoleEnum.STAFF, "Default user role",
            RoleEnum.ADMIN, "Administrator role",
            RoleEnum.SUPER_ADMIN, "Super Administrator role");

        Arrays.stream(roleNames).forEach(roleName-> {
            try {
                Optional<Role> optionalRole = roleRepository.findByName(roleName);

                optionalRole.ifPresentOrElse(
                    role -> logger.info("Role already exists: {}", role),
                    () -> {
                    // Role roleToCreate = new Role();

                    Role roleToCreate = Role.builder().name(roleName)
                            .description(roleDescriptionMap.get(roleName)).build();
                    roleRepository.save(roleToCreate);
                    logger.info("Created new role: {}", roleToCreate);
                });
            } catch (Exception e) {
                logger.error("Error creating role: {}", roleName, e);
            }
            
        });
    }
}
