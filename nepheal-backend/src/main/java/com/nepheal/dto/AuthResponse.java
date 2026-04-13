package com.nepheal.dto;


public class AuthResponse {
    private String token;
    private String role;
    private String fullName;

    public AuthResponse() {}

    public AuthResponse(String token, String role, String fullName) {
        this.token = token;
        this.role = role;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    // Manual Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String role;
        private String fullName;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, role, fullName);
        }
    }
}
