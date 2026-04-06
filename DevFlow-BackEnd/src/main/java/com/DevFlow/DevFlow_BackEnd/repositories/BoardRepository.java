package com.DevFlow.DevFlow_BackEnd.repositories;

import com.DevFlow.DevFlow_BackEnd.domain.entities.Board;
import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {

    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.id = :boardId")
    long countTasksByBoardId(UUID boardId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.board.id = :boardId AND t.status = :status")
    long countTasksByBoardIdAndStatus(UUID boardId, TaskStatus status);
}
