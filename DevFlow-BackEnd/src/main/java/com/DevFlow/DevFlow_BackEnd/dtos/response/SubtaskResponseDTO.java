package com.DevFlow.DevFlow_BackEnd.dtos.response;

import java.util.UUID;

public record SubtaskResponseDTO(
        UUID id,
        String title,
        boolean done
) {}
