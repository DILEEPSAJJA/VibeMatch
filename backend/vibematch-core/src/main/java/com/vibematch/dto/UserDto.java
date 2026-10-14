package com.vibematch.dto;

import com.vibematch.entity.User;
import java.time.LocalDateTime;
import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String location;
    private String gender;
    private Integer age;
    private String vibeArchetype;
    private Boolean isOnline;
    private LocalDateTime lastSeen;
    private Boolean isVerified;
    private String role;
    private Set<String> interests;
    private Set<String> hobbies;
    private Set<String> languages;
    private LocalDateTime createdAt;

    public UserDto() {}

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setBio(user.getBio());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setLocation(user.getLocation());
        dto.setGender(user.getGender());
        dto.setAge(user.getAge());
        dto.setVibeArchetype(user.getVibeArchetype());
        dto.setIsOnline(user.getIsOnline());
        dto.setLastSeen(user.getLastSeen());
        dto.setIsVerified(user.getIsVerified());
        dto.setRole(user.getRole());
        dto.setInterests(user.getInterests());
        dto.setHobbies(user.getHobbies());
        dto.setLanguages(user.getLanguages());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getVibeArchetype() { return vibeArchetype; }
    public void setVibeArchetype(String vibeArchetype) { this.vibeArchetype = vibeArchetype; }
    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Set<String> getInterests() { return interests; }
    public void setInterests(Set<String> interests) { this.interests = interests; }
    public Set<String> getHobbies() { return hobbies; }
    public void setHobbies(Set<String> hobbies) { this.hobbies = hobbies; }
    public Set<String> getLanguages() { return languages; }
    public void setLanguages(Set<String> languages) { this.languages = languages; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
