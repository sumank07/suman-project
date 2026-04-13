package com.nepheal.dto;


public class DashboardStatsDTO {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long activeToday;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalDoctors, long totalPatients, long totalAppointments, long activeToday) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.activeToday = activeToday;
    }

    // Getters and Setters
    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getActiveToday() { return activeToday; }
    public void setActiveToday(long activeToday) { this.activeToday = activeToday; }

    // Manual Builder
    public static DashboardStatsDTOBuilder builder() {
        return new DashboardStatsDTOBuilder();
    }

    public static class DashboardStatsDTOBuilder {
        private long totalDoctors;
        private long totalPatients;
        private long totalAppointments;
        private long activeToday;

        public DashboardStatsDTOBuilder totalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; return this; }
        public DashboardStatsDTOBuilder totalPatients(long totalPatients) { this.totalPatients = totalPatients; return this; }
        public DashboardStatsDTOBuilder totalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; return this; }
        public DashboardStatsDTOBuilder activeToday(long activeToday) { this.activeToday = activeToday; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(totalDoctors, totalPatients, totalAppointments, activeToday);
        }
    }
}
