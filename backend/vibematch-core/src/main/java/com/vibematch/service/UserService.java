package com.vibematch.service;

import com.vibematch.dto.SocialDto.UserPreferenceDto;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.User;
import com.vibematch.entity.UserPreference;
import com.vibematch.repository.UserPreferenceRepository;
import com.vibematch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;

    public UserService(UserRepository userRepository, UserPreferenceRepository preferenceRepository) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
    }

    public UserDto getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UserDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getBio() != null) user.setBio(updateDto.getBio());
        if (updateDto.getAvatarUrl() != null) user.setAvatarUrl(updateDto.getAvatarUrl());
        if (updateDto.getLocation() != null) user.setLocation(updateDto.getLocation());
        if (updateDto.getGender() != null) user.setGender(updateDto.getGender());
        if (updateDto.getAge() != null) user.setAge(updateDto.getAge());
        if (updateDto.getVibeArchetype() != null) user.setVibeArchetype(updateDto.getVibeArchetype());
        if (updateDto.getInterests() != null) user.setInterests(updateDto.getInterests());
        if (updateDto.getHobbies() != null) user.setHobbies(updateDto.getHobbies());
        if (updateDto.getLanguages() != null) user.setLanguages(updateDto.getLanguages());

        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    public UserPreferenceDto getPreferences(Long userId) {
        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    return preferenceRepository.save(new UserPreference(user));
                });

        UserPreferenceDto dto = new UserPreferenceDto();
        dto.setMinAge(pref.getMinAge());
        dto.setMaxAge(pref.getMaxAge());
        dto.setMaxDistanceKm(pref.getMaxDistanceKm());
        dto.setGhostMode(pref.getGhostMode());
        dto.setShowReadReceipts(pref.getShowReadReceipts());
        dto.setShowActiveStatus(pref.getShowActiveStatus());
        dto.setProfileVisibility(pref.getProfileVisibility());
        return dto;
    }

    @Transactional
    public UserPreferenceDto updatePreferences(Long userId, UserPreferenceDto dto) {
        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    return new UserPreference(user);
                });

        if (dto.getMinAge() != null) pref.setMinAge(dto.getMinAge());
        if (dto.getMaxAge() != null) pref.setMaxAge(dto.getMaxAge());
        if (dto.getMaxDistanceKm() != null) pref.setMaxDistanceKm(dto.getMaxDistanceKm());
        if (dto.getGhostMode() != null) pref.setGhostMode(dto.getGhostMode());
        if (dto.getShowReadReceipts() != null) pref.setShowReadReceipts(dto.getShowReadReceipts());
        if (dto.getShowActiveStatus() != null) pref.setShowActiveStatus(dto.getShowActiveStatus());
        if (dto.getProfileVisibility() != null) pref.setProfileVisibility(dto.getProfileVisibility());

        pref = preferenceRepository.save(pref);
        return dto;
    }

    @Transactional
    public void updateOnlineStatus(Long userId, boolean isOnline) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsOnline(isOnline);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}
