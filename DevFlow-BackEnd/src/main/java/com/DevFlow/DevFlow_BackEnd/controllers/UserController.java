package com.DevFlow.DevFlow_BackEnd.controllers;

import com.DevFlow.DevFlow_BackEnd.dtos.response.UserResponseDTO;
import com.DevFlow.DevFlow_BackEnd.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }
}
