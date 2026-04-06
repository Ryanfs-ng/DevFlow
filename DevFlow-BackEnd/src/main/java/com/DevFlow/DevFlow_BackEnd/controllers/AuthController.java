package com.DevFlow.DevFlow_BackEnd.controllers;

import com.DevFlow.DevFlow_BackEnd.dtos.request.LoginRequestDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.AuthResponseDTO;
import com.DevFlow.DevFlow_BackEnd.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.login(request));
    }
}
