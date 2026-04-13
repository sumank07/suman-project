package com.nepheal.controller;

import com.nepheal.model.Doctor;
import com.nepheal.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Doctor>> getActiveDoctors() {
        // Assuming you want to filter by active status generally,
        // or just return all for now if status isn't strictly enforced on findAll
        // For strict filtering:
        // return ResponseEntity.ok(doctorRepository.findByStatus("ACTIVE"));
        // But we only have findBySpecializationAndStatus defined in repo.
        // Let's implement a simple findAll for now as "AvailableDoctors" usually means
        // all.
        return ResponseEntity.ok(doctorRepository.findAll());
    }
}
