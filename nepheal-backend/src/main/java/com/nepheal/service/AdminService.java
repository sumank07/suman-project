package com.nepheal.service;

import com.nepheal.dto.DashboardStatsDTO;
import com.nepheal.dto.RegisterRequest;
import com.nepheal.model.Doctor;
import com.nepheal.repository.AppointmentRepository;
import com.nepheal.repository.DoctorRepository;
import com.nepheal.repository.PatientRepository;
import com.nepheal.repository.UserRepository; // Needed for delete
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@SuppressWarnings("null")
public class AdminService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AdminService(DoctorRepository doctorRepository,
                        PatientRepository patientRepository,
                        AppointmentRepository appointmentRepository,
                        UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        long doctors = doctorRepository.count();
        long patients = patientRepository.count();
        long appointments = appointmentRepository.count();
        long todayAppointments = appointmentRepository.countByDateBetween(startOfDay, endOfDay);

        // For "Active Today", we can use today's appointments as a proxy for activity
        // or just return the appointments count for today.

        return DashboardStatsDTO.builder()
                .totalDoctors(doctors)
                .totalPatients(patients)
                .totalAppointments(appointments)
                .activeToday(todayAppointments)
                .build();
    }

    @Transactional
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Delete appointments associated with this doctor first to avoid FK constraint violation
        appointmentRepository.deleteByDoctorId(doctorId);

        // Delete the doctor entity
        doctorRepository.delete(doctor);

        // Also delete the User account
        userRepository.delete(doctor.getUser());
    }

    @Transactional
    public void deletePatient(Long patientId) {
        com.nepheal.model.Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Delete appointments associated with this patient first to avoid FK constraint violation
        appointmentRepository.deleteByPatientId(patientId);

        // Delete the patient entity
        patientRepository.delete(patient);

        // Also delete the User account
        userRepository.delete(patient.getUser());
    }

    // Doctor Management
    public Doctor addDoctor(RegisterRequest request) {
        // This should reuse AuthService logic or be independent.
        // For simplicity, let's assume we reuse AuthService logic via a different flow
        // or duplicate essential parts for now
        // BUT ideally, we should inject AuthenticationService if possible.
        // Given complexity, let's assume the Controller calls AuthService.register
        // directly for adding users,
        // and here we might handle doctor-specific details if needed.
        // Actually, let's keep it simple: Controller will handle "add doctor" by
        // delegating to AuthService.
        return null;
    }

    public java.util.List<com.nepheal.model.Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public java.util.List<com.nepheal.model.Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    @Transactional
    public com.nepheal.model.Appointment updateAppointmentStatus(Long id, com.nepheal.model.AppointmentStatus status) {
        com.nepheal.model.Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public com.nepheal.model.Appointment rescheduleAppointment(Long id, LocalDateTime dateTime) {
        com.nepheal.model.Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setDateTime(dateTime);
        // Reset status to pending when rescheduled
        appointment.setStatus(com.nepheal.model.AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Doctor toggleDoctorStatus(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if ("ACTIVE".equalsIgnoreCase(doctor.getStatus())) {
            doctor.setStatus("ON_LEAVE");
        } else {
            doctor.setStatus("ACTIVE");
        }
        return doctorRepository.save(doctor);
    }
}
