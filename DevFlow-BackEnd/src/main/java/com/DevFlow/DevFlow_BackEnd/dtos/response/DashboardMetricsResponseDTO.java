package com.DevFlow.DevFlow_BackEnd.dtos.response;

public record DashboardMetricsResponseDTO(
        long total,
        long doing,
        long done,
        long overdue,
        long backlog
) {}
