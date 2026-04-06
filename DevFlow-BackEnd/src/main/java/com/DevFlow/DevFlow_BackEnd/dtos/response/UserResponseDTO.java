package com.DevFlow.DevFlow_BackEnd.dtos.response;

import com.DevFlow.DevFlow_BackEnd.domain.enums.UserRole;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String name,
        String email,
        String avatar,
        String initials,
        UserRole role,
        String color
) {}
