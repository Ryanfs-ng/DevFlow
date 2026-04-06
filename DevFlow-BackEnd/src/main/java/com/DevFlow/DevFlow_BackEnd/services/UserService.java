package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.dtos.response.UserResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(authService::toDTO)
                .toList();
    }
}
