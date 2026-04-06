package com.DevFlow.DevFlow_BackEnd.controllers;

import com.DevFlow.DevFlow_BackEnd.dtos.response.DashboardMetricsResponseDTO;
import com.DevFlow.DevFlow_BackEnd.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponseDTO> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }
}
