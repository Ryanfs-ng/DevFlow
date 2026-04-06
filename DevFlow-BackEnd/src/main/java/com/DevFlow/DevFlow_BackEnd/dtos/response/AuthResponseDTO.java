package com.DevFlow.DevFlow_BackEnd.dtos.response;

import java.util.UUID;

public record AuthResponseDTO(
        String token,
        UserResponseDTO user,
        long expiresIn
) {}
