package com.nepheal.dto;

import java.time.LocalDateTime;

public class AppointmentRequest {
    private String specialization;
    private LocalDateTime dateTime;
    private String notes;

    public AppointmentRequest() {}

    public AppointmentRequest(String specialization, LocalDateTime dateTime, String notes) {
        this.specialization = specialization;
        this.dateTime = dateTime;
        this.notes = notes;
    }

    // Getters and Setters
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
