package com.DevFlow.DevFlow_BackEnd.dtos.request;

import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskPriority;
import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Usado em POST (criação) e PUT (atualização parcial).
 * Campos omitidos ou nulos no PUT são ignorados; merge com o estado atual da entidade.
 */
public record TaskRequestDTO(
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        UUID boardId,
        List<UUID> assigneeIds,
        List<String> tags,
        LocalDate startDate,
        LocalDate dueDate,
        Integer order
) {}
