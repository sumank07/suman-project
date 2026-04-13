package com.nepheal.repository;

import com.nepheal.model.Appointment;
import com.nepheal.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // For Round Robin logic: Count appointments for a doctor between a time range
    // (the whole day)
    @Query("SELECT count(a) FROM Appointment a WHERE a.doctor = :doctor AND a.dateTime BETWEEN :start AND :end")
    long countByDoctorAndDate(Doctor doctor, LocalDateTime start, LocalDateTime end);

    @Query("SELECT count(a) FROM Appointment a WHERE a.dateTime BETWEEN :start AND :end")
    long countByDateBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    void deleteByDoctorId(Long doctorId);

    void deleteByPatientId(Long patientId);
}
