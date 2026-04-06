package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.domain.entities.Board;
import com.DevFlow.DevFlow_BackEnd.domain.entities.User;
import com.DevFlow.DevFlow_BackEnd.dtos.request.BoardRequestDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.BoardResponseDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.UserResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.BoardRepository;
import com.DevFlow.DevFlow_BackEnd.repositories.TaskRepository;
import com.DevFlow.DevFlow_BackEnd.repositories.UserRepository;
import com.DevFlow.DevFlow_BackEnd.domain.enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public List<BoardResponseDTO> findAll() {
        return boardRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public BoardResponseDTO findById(UUID id) {
        return boardRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board não encontrado"));
    }

    @Transactional
    public BoardResponseDTO create(BoardRequestDTO request) {
        if (!StringUtils.hasText(request.name())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        UUID currentUserId = UUID.fromString(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );

        String color = StringUtils.hasText(request.color()) ? request.color().trim() : "#6366f1";
        String emoji = StringUtils.hasText(request.emoji()) ? request.emoji().trim() : "📋";

        LinkedHashSet<UUID> ids = new LinkedHashSet<>();
        if (request.memberIds() != null) {
            ids.addAll(request.memberIds());
        }
        ids.add(currentUserId);

        List<User> members = userRepository.findAllById(ids);
        if (members.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhum membro válido");
        }

        Board board = Board.builder()
                .name(request.name().trim())
                .description(StringUtils.hasText(request.description()) ? request.description().trim() : null)
                .color(color)
                .emoji(emoji)
                .members(new ArrayList<>(members))
                .build();

        return toDTO(boardRepository.save(board));
    }

    @Transactional
    public BoardResponseDTO update(UUID id, BoardRequestDTO request) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board não encontrado"));

        UUID currentUserId = UUID.fromString(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );

        if (request.name() != null) {
            if (!StringUtils.hasText(request.name())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome não pode ser vazio");
            }
            board.setName(request.name().trim());
        }
        if (request.description() != null) {
            board.setDescription(StringUtils.hasText(request.description()) ? request.description().trim() : null);
        }
        if (request.color() != null && StringUtils.hasText(request.color())) {
            board.setColor(request.color().trim());
        }
        if (request.emoji() != null && StringUtils.hasText(request.emoji())) {
            board.setEmoji(request.emoji().trim());
        }
        if (request.memberIds() != null) {
            LinkedHashSet<UUID> ids = new LinkedHashSet<>(request.memberIds());
            ids.add(currentUserId);
            List<User> members = userRepository.findAllById(ids);
            if (members.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhum membro válido");
            }
            board.setMembers(new ArrayList<>(members));
        }

        return toDTO(boardRepository.save(board));
    }

    @Transactional
    public void delete(UUID id) {
        if (!boardRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board não encontrado");
        }
        taskRepository.deleteByBoardId(id);
        boardRepository.deleteById(id);
    }

    private BoardResponseDTO toDTO(Board board) {
        long taskCount = boardRepository.countTasksByBoardId(board.getId());
        long completedCount = boardRepository.countTasksByBoardIdAndStatus(board.getId(), TaskStatus.DONE);

        List<UserResponseDTO> members = board.getMembers().stream()
                .map(authService::toDTO)
                .toList();

        return new BoardResponseDTO(
                board.getId(),
                board.getName(),
                board.getDescription(),
                board.getColor(),
                board.getEmoji(),
                members,
                taskCount,
                completedCount,
                board.getCreatedAt(),
                board.getUpdatedAt()
        );
    }
}
