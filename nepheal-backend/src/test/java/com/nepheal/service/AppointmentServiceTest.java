package com.nepheal.service;

import com.nepheal.dto.AppointmentRequest;
import com.nepheal.model.*;
import com.nepheal.repository.AppointmentRepository;
import com.nepheal.repository.DoctorRepository;
import com.nepheal.repository.PatientRepository;
import com.nepheal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Arrays;
// import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testRoundRobin_LeastLoadedSelection() {
        // Given
        String email = "patient@test.com";
        UUID userId = UUID.randomUUID();
        User patientUser = User.builder().id(userId).email(email).build();
        Patient patient = Patient.builder().id(1L).user(patientUser).build();

        // 2 Doctors
        Doctor doc1 = Doctor.builder().id(101L).specialization("Cardiology").build();
        Doctor doc2 = Doctor.builder().id(102L).specialization("Cardiology").build();

        AppointmentRequest request = new AppointmentRequest();
        request.setSpecialization("Cardiology");
        request.setDateTime(LocalDateTime.now().plusDays(1));

        // Mock Auth
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(patientUser));
        when(patientRepository.findByUserId(userId)).thenReturn(Optional.of(patient));

        // Mock Doctors Availability
        when(doctorRepository.findBySpecializationAndStatus("Cardiology", "ACTIVE"))
                .thenReturn(Arrays.asList(doc1, doc2));

        // Mock Load: Doc1 has 5 appointments, Doc2 has 2 appointments
        when(appointmentRepository.countByDoctorAndDate(eq(doc1), any(), any())).thenReturn(5L);
        when(appointmentRepository.countByDoctorAndDate(eq(doc2), any(), any())).thenReturn(2L);

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        Appointment result = appointmentService.bookAppointment(request);

        // Then
        // Expect DOCTOR 2 (Least Loaded)
        assertEquals(102L, result.getDoctor().getId());
        System.out.println(
                "Selected Doctor ID: " + result.getDoctor().getId() + " (Expected 102 because load is 2 vs 5)");
    }
}
