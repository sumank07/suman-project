package com.nepheal.config;

import com.nepheal.model.Role;
import com.nepheal.model.User;
import com.nepheal.model.Doctor;
import com.nepheal.repository.UserRepository;
import com.nepheal.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin if doesn't exist
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin seeded: admin@gmail.com / admin123");
        }
        
        // Seed a default Doctor for testing if doesn't exist
        if (userRepository.findByEmail("doctor@gmail.com").isEmpty()) {
            User doctorUser = User.builder()
                    .fullName("Dr. Smith")
                    .email("doctor@gmail.com")
                    .password(passwordEncoder.encode("doctor123"))
                    .role(Role.DOCTOR)
                    .build();
            userRepository.save(doctorUser);
            
            Doctor doctor = Doctor.builder()
                    .user(doctorUser)
                    .specialization("General")
                    .experienceYears(10)
                    .status("ACTIVE")
                    .build();
            doctorRepository.save(doctor);
            
            System.out.println("Default doctor seeded: doctor@gmail.com / doctor123");
        }
    }
}
