package com.nepheal.service;

import com.nepheal.dto.AppointmentRequest;
import com.nepheal.model.*;
import com.nepheal.repository.AppointmentRepository;
import com.nepheal.repository.DoctorRepository;
import com.nepheal.repository.PatientRepository;
import com.nepheal.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
@SuppressWarnings("null")
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        // 1. Get Current Patient
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user"));

        // 2. Find Available Doctors by Specialization
        List<Doctor> doctors = doctorRepository.findBySpecializationAndStatus(
                request.getSpecialization(), "ACTIVE");

        if (doctors.isEmpty()) {
            throw new RuntimeException("No active doctors found for specialization: " + request.getSpecialization());
        }

        // 3. Round Robin Logic
        // Find the doctor with the LEAST appointments on the requested day
        LocalDateTime startOfDay = request.getDateTime().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = request.getDateTime().toLocalDate().atTime(LocalTime.MAX);

        Doctor bestDoctor = doctors.stream()
                .min(Comparator
                        .comparingLong(doc -> appointmentRepository.countByDoctorAndDate(doc, startOfDay, endOfDay)))
                .orElse(doctors.get(0));

        // 4. Create Appointment
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(bestDoctor)
                .dateTime(request.getDateTime())
                .status(AppointmentStatus.PENDING)
                .notes(request.getNotes())
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getMyAppointments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUserId(user.getId()).orElseThrow();
            return appointmentRepository.findByPatientId(patient.getId());
        } else if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(user.getId()).orElseThrow();
            return appointmentRepository.findByDoctorId(doctor.getId());
        }
        return List.of();
    }
}
