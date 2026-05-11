package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.domain.entities.Board;
import com.DevFlow.DevFlow_BackEnd.domain.entities.Subtask;
import com.DevFlow.DevFlow_BackEnd.domain.entities.Task;
import com.DevFlow.DevFlow_BackEnd.domain.entities.User;
import com.DevFlow.DevFlow_BackEnd.dtos.request.TaskRequestDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.SubtaskResponseDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.TaskResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.BoardRepository;
import com.DevFlow.DevFlow_BackEnd.repositories.TaskRepository;
import com.DevFlow.DevFlow_BackEnd.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findAll() {
        return taskRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findByBoardId(UUID boardId) {
        return taskRepository.findByBoardId(boardId).stream()
                .map(this::toDTO)
                .toList();
    }

    public TaskResponseDTO create(TaskRequestDTO request) {
        if (!StringUtils.hasText(request.title())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título é obrigatório");
        }
        if (request.boardId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "boardId é obrigatório");
        }
        if (request.status() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status é obrigatório");
        }
        if (request.priority() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "priority é obrigatório");
        }

        Board board = boardRepository.findById(request.boardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board não encontrado"));

        List<UUID> ids = request.assigneeIds() != null ? request.assigneeIds() : List.of();
        List<User> assignees = userRepository.findAllById(ids);

        int order = request.order() != null ? request.order() : 0;
        List<String> tags = request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>();

        Task task = Task.builder()
                .title(request.title().trim())
                .description(request.description())
                .status(request.status())
                .priority(request.priority())
                .board(board)
                .assignees(assignees)
                .tags(tags)
                .startDate(request.startDate())
                .dueDate(request.dueDate())
                .order(order)
                .build();

        return toDTO(taskRepository.save(task));
    }

    public TaskResponseDTO update(UUID id, TaskRequestDTO request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task não encontrada"));

        if (request.title() != null) {
            if (!StringUtils.hasText(request.title())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título não pode ser vazio");
            }
            task.setTitle(request.title().trim());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        if (request.boardId() != null) {
            Board board = boardRepository.findById(request.boardId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board não encontrado"));
            task.setBoard(board);
        }
        if (request.assigneeIds() != null) {
            task.setAssignees(userRepository.findAllById(request.assigneeIds()));
        }
        if (request.tags() != null) {
            task.setTags(new ArrayList<>(request.tags()));
        }
        if (request.startDate() != null) {
            task.setStartDate(request.startDate());
        }
        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.order() != null) {
            task.setOrder(request.order());
        }

        return toDTO(taskRepository.save(task));
    }

    public void delete(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task não encontrada");
        }
        taskRepository.deleteById(id);
    }

    private TaskResponseDTO toDTO(Task task) {
        List<SubtaskResponseDTO> subtasks = task.getSubtasks().stream()
                .map(this::toSubtaskDTO)
                .toList();

        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getBoard().getId(),
                task.getAssignees().stream().map(authService::toDTO).toList(),
                task.getTags(),
                task.getStartDate(),
                task.getDueDate(),
                task.getOrder(),
                subtasks,
                0,
                0,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    private SubtaskResponseDTO toSubtaskDTO(Subtask subtask) {
        return new SubtaskResponseDTO(subtask.getId(), subtask.getTitle(), subtask.isDone());
    }
}
