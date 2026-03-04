package com.salesmatrix.controller;

import com.salesmatrix.dto.DashboardAnalyticsDTO;
import com.salesmatrix.service.DashboardAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    @GetMapping("/analytics")
    public ResponseEntity<DashboardAnalyticsDTO> getAnalytics(
            @RequestParam Long storeId,
            @RequestParam(required = false) Integer year
    ) {
        if (year == null) {
            year = java.time.Year.now().getValue();
        }
        
        DashboardAnalyticsDTO analytics = dashboardAnalyticsService.getAnalytics(storeId, year);
        return ResponseEntity.ok(analytics);
    }
}
