package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.LoginRequest;
import com.marees.orderinventory.dto.LoginResponse;
import com.marees.orderinventory.entity.User;
import com.marees.orderinventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid username or password"
            );
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return new LoginResponse(token);
    }
}