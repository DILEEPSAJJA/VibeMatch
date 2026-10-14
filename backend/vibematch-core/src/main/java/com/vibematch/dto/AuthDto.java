package com.vibematch.dto;

import java.util.Set;

public class AuthDto {

    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String usernameOrEmail, String password) {
            this.usernameOrEmail = usernameOrEmail;
            this.password = password;
        }
        public String getUsernameOrEmail() { return usernameOrEmail; }
        public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String gender;
        private Integer age;
        private String location;
        private String vibeArchetype;
        private Set<String> interests;
        private Set<String> hobbies;
        private Set<String> languages;

        public RegisterRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getVibeArchetype() { return vibeArchetype; }
        public void setVibeArchetype(String vibeArchetype) { this.vibeArchetype = vibeArchetype; }
        public Set<String> getInterests() { return interests; }
        public void setInterests(Set<String> interests) { this.interests = interests; }
        public Set<String> getHobbies() { return hobbies; }
        public void setHobbies(Set<String> hobbies) { this.hobbies = hobbies; }
        public Set<String> getLanguages() { return languages; }
        public void setLanguages(Set<String> languages) { this.languages = languages; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserDto user;

        public AuthResponse() {}
        public AuthResponse(String token, UserDto user) {
            this.token = token;
            this.user = user;
        }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }
        public UserDto getUser() { return user; }
        public void setUser(UserDto user) { this.user = user; }
    }
}
