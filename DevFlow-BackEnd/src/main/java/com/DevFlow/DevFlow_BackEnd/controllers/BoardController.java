package com.DevFlow.DevFlow_BackEnd.controllers;

import com.DevFlow.DevFlow_BackEnd.dtos.request.BoardRequestDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.BoardResponseDTO;
import com.DevFlow.DevFlow_BackEnd.dtos.response.TaskResponseDTO;
import com.DevFlow.DevFlow_BackEnd.services.BoardService;
import com.DevFlow.DevFlow_BackEnd.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<BoardResponseDTO>> findAll() {
        return ResponseEntity.ok(boardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(boardService.findById(id));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> findTasksByBoard(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.findByBoardId(id));
    }

    @PostMapping
    public ResponseEntity<BoardResponseDTO> create(@RequestBody BoardRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> update(@PathVariable UUID id, @RequestBody BoardRequestDTO request) {
        return ResponseEntity.ok(boardService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
