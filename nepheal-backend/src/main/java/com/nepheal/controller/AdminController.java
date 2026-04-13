package com.nepheal.controller;

import com.nepheal.dto.DashboardStatsDTO;
import com.nepheal.dto.RegisterRequest;
import com.nepheal.service.AdminService;
import com.nepheal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addDoctor(@RequestBody RegisterRequest request) {
        // Force role to DOCTOR for security
        request.setRole("DOCTOR");
        return ResponseEntity.ok(authService.register(request));
    }

    @DeleteMapping("/doctors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(adminService.getAllAppointments());
    }

    @DeleteMapping("/appointments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        adminService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/appointments/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestParam com.nepheal.model.AppointmentStatus status) {
        return ResponseEntity.ok(adminService.updateAppointmentStatus(id, status));
    }

    @PutMapping("/appointments/{id}/reschedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long id, @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime dateTime) {
        return ResponseEntity.ok(adminService.rescheduleAppointment(id, dateTime));
    }

    @PutMapping("/doctors/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleDoctorStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleDoctorStatus(id));
    }
}
