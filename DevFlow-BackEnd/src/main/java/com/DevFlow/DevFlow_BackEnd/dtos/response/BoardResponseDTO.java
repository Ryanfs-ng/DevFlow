package com.DevFlow.DevFlow_BackEnd.dtos.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record BoardResponseDTO(
        UUID id,
        String name,
        String description,
        String color,
        String emoji,
        List<UserResponseDTO> members,
        long taskCount,
        long completedCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
