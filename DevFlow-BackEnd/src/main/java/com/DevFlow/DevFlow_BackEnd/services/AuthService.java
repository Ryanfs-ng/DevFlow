package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.config.JwtService;
import com.DevFlow.DevFlow_BackEnd.domain.entities.User;
import com.DevFlow.DevFlow_BackEnd.dtos.request.LoginRequestDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.AuthResponseDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.UserResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${jwt.expiration}")
    private long expiration;

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        String token = jwtService.generateToken(user.getId().toString());

        return new AuthResponseDTO(token, toDTO(user), expiration / 1000);
    }

    UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatar(),
                user.getInitials(),
                user.getRole(),
                user.getColor()
        );
    }
}
