package com.nepheal.repository;

import com.nepheal.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationAndStatus(String specialization, String status);

    Optional<Doctor> findByUserId(java.util.UUID userId);
}
