package com.DevFlow.DevFlow_BackEnd.dtos.response;

import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskPriority;
import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TaskResponseDTO(
        UUID id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        UUID boardId,
        List<UserResponseDTO> assignees,
        List<String> tags,
        LocalDate startDate,
        LocalDate dueDate,
        int order,
        List<SubtaskResponseDTO> subtasks,
        int commentsCount,
        int attachmentsCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
