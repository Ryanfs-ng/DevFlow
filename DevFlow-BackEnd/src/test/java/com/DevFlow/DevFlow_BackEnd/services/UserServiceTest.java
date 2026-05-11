package com.DevFlow.DevFlow_BackEnd.services;

import com.DevFlow.DevFlow_BackEnd.domain.entities.User;
import com.DevFlow.DevFlow_BackEnd.dtos.response.UserResponseDTO;
import com.DevFlow.DevFlow_BackEnd.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private UserService service;

    @Test
    void deveRetornarUsuarios() {

        User user = new User();

        UserResponseDTO dto = new UserResponseDTO(
                UUID.randomUUID(),
                "Ryan",
                "ryan@email.com",
                "avatar.png",
                "RF",
                null,
                "blue"
        );

        when(repository.findAll())
                .thenReturn(List.of(user));

        when(authService.toDTO(user))
                .thenReturn(dto);

        var result = service.findAll();

        assertNotNull(result);
    }
}