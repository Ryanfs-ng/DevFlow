package com.DevFlow.DevFlow_BackEnd.repositories;

import com.DevFlow.DevFlow_BackEnd.domain.entities.Task;
import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByBoardId(UUID boardId);

    List<Task> findByStatus(TaskStatus status);

    long countByStatus(TaskStatus status);

    // TODO: usado no cálculo de métricas do dashboard
    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status <> 'DONE'")
    long countOverdue(LocalDate today);

    @Modifying
    @Query("DELETE FROM Task t WHERE t.board.id = :boardId")
    void deleteByBoardId(@Param("boardId") UUID boardId);
}
