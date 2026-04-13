package com.nepheal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String specialization;

    private Integer experienceYears;

    private String status; // ACTIVE, ON_LEAVE

    public Doctor() {}

    public Doctor(Long id, User user, String specialization, Integer experienceYears, String status) {
        this.id = id;
        this.user = user;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Manual Builder
    public static DoctorBuilder builder() {
        return new DoctorBuilder();
    }

    public static class DoctorBuilder {
        private Long id;
        private User user;
        private String specialization;
        private Integer experienceYears;
        private String status;

        public DoctorBuilder id(Long id) { this.id = id; return this; }
        public DoctorBuilder user(User user) { this.user = user; return this; }
        public DoctorBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public DoctorBuilder experienceYears(Integer experienceYears) { this.experienceYears = experienceYears; return this; }
        public DoctorBuilder status(String status) { this.status = status; return this; }

        public Doctor build() {
            return new Doctor(id, user, specialization, experienceYears, status);
        }
    }
}
