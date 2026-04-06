package com.DevFlow.DevFlow_BackEnd.dtos.request;

import java.util.List;
import java.util.UUID;

public record BoardRequestDTO(
        String name,
        String description,
        String color,
        String emoji,
        List<UUID> memberIds
) {}
