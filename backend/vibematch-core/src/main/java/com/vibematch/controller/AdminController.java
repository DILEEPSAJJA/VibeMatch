package com.vibematch.controller;

import com.vibematch.dto.ExtraDto.AdminMetricsDto;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.Report;
import com.vibematch.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDto> getMetrics() {
        return ResponseEntity.ok(adminService.getMetrics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users/{id}/toggle-verify")
    public ResponseEntity<UserDto> toggleVerify(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleVerify(id));
    }

    @PostMapping("/users/{id}/toggle-ban")
    public ResponseEntity<UserDto> toggleBan(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBan(id));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<Report> resolveReport(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "RESOLVED");
        return ResponseEntity.ok(adminService.resolveReport(id, status));
    }
}
