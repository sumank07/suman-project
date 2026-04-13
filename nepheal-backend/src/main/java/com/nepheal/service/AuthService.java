package com.nepheal.service;

import com.nepheal.config.JwtUtils;
import com.nepheal.dto.AuthResponse;
import com.nepheal.dto.LoginRequest;
import com.nepheal.dto.RegisterRequest;
import com.nepheal.model.*;
import com.nepheal.repository.DoctorRepository;
import com.nepheal.repository.PatientRepository;
import com.nepheal.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@SuppressWarnings("null")
public class AuthService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, 
                       DoctorRepository doctorRepository, 
                       PatientRepository patientRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtUtils jwtUtils, 
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        var role = Role.valueOf(request.getRole().toUpperCase());

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        if (role == Role.DOCTOR) {
            var doctor = Doctor.builder()
                    .user(user)
                    .specialization(request.getSpecialization())
                    .experienceYears(request.getExperienceYears())
                    .status("ACTIVE")
                    .build();
            doctorRepository.save(doctor);
        } else if (role == Role.PATIENT) {
            var patient = Patient.builder()
                    .user(user)
                    .dob(LocalDate.parse(request.getDob()))
                    .gender(request.getGender())
                    .contactNumber(request.getContactNumber())
                    .build();
            patientRepository.save(patient);
        }

        var jwtToken = jwtUtils.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtUtils.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .build();
    }
}
