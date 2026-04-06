package com.DevFlow.DevFlow_BackEnd.repositories;

import com.DevFlow.DevFlow_BackEnd.domain.entities.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubtaskRepository extends JpaRepository<Subtask, UUID> {

    List<Subtask> findByTaskId(UUID taskId);
}
