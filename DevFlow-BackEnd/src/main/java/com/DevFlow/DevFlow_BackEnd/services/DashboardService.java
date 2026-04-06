package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;
import com.DevFlow.DevFlow_BackEnd.dtos.response.DashboardMetricsResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardMetricsResponseDTO getMetrics() {
        long total   = taskRepository.count();
        long doing   = taskRepository.countByStatus(TaskStatus.DOING);
        long done    = taskRepository.countByStatus(TaskStatus.DONE);
        long backlog = taskRepository.countByStatus(TaskStatus.BACKLOG);

        // TODO: considerar filtrar métricas por usuário autenticado quando segurança for implementada
        long overdue = taskRepository.countOverdue(LocalDate.now());

        return new DashboardMetricsResponseDTO(total, doing, done, overdue, backlog);
    }
}
