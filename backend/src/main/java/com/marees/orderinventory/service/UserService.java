package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.UserRequest;
import com.marees.orderinventory.dto.UserResponse;
import com.marees.orderinventory.entity.User;
import com.marees.orderinventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(UserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists: " + request.getUsername()
            );
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setRole(savedUser.getRole());

        return response;
    }
}