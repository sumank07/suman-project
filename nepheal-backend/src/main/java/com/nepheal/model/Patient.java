package com.nepheal.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private LocalDate dob;

    private String gender;

    private String contactNumber;

    public Patient() {}

    public Patient(Long id, User user, LocalDate dob, String gender, String contactNumber) {
        this.id = id;
        this.user = user;
        this.dob = dob;
        this.gender = gender;
        this.contactNumber = contactNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    // Manual Builder
    public static PatientBuilder builder() {
        return new PatientBuilder();
    }

    public static class PatientBuilder {
        private Long id;
        private User user;
        private LocalDate dob;
        private String gender;
        private String contactNumber;

        public PatientBuilder id(Long id) { this.id = id; return this; }
        public PatientBuilder user(User user) { this.user = user; return this; }
        public PatientBuilder dob(LocalDate dob) { this.dob = dob; return this; }
        public PatientBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientBuilder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }

        public Patient build() {
            return new Patient(id, user, dob, gender, contactNumber);
        }
    }
}
