package com.backend.taskmaster.auth.bootstrap;

import java.util.Arrays;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.backend.taskmaster.auth.common.request.RegistrationRequest;
import com.backend.taskmaster.auth.entities.Role;
import com.backend.taskmaster.auth.entities.RoleEnum;
import com.backend.taskmaster.auth.entities.User;
import com.backend.taskmaster.auth.repository.role.RoleRepository;
import com.backend.taskmaster.auth.repository.user.UserRepository;

@Component
@Order(2)
public class AdminSeeder implements ApplicationListener<ContextRefreshedEvent> {
    private static final Logger logger = LogManager.getLogger(AdminSeeder.class);
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public AdminSeeder(
        RoleRepository roleRepository,
        UserRepository  userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        try {
            createSuperAdministrator();
        } catch (Exception e) {
            logger.error("Failed to seed super administrator", e);
        }
    }

    private void createSuperAdministrator() {
        var userDto = RegistrationRequest.builder()
            .firstname("Super")
            .lastname("Admin")
            .email("super.admin@email.com")
            .password("password")
            .build();

        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.SUPER_ADMIN);
        Optional<User> optionalUser = userRepository.findByEmail(userDto.getEmail());

        if (optionalRole.isEmpty()) {
            logger.error("The SUPER_ADMIN role does not exist in the database.");
            return;
        }
    
        if (optionalUser.isPresent()) {
            logger.info("A super administrator already exists with the email: {}", userDto.getEmail());
            return;
        }

        // String fullName = userDto.getFirstname() + ' ' + userDto.getLastname();
        var user = User.builder()
            .firstname(userDto.getFirstname())
            .lastname(userDto.getLastname())
            .email(userDto.getEmail())
            .enabled(true)
            .password(passwordEncoder.encode(userDto.getPassword()))
            .roles(Arrays.asList(optionalRole.get()))
            .build();

        userRepository.save(user);
        logger.info("Successfully seed SUPER ADMINISTRATOR role to the database.");
    }
}
