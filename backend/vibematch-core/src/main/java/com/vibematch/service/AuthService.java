package com.vibematch.service;

import com.vibematch.dto.AuthDto.*;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.User;
import com.vibematch.entity.UserPreference;
import com.vibematch.repository.UserPreferenceRepository;
import com.vibematch.repository.UserRepository;
import com.vibematch.security.JwtTokenProvider;
import com.vibematch.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       UserPreferenceRepository preferenceRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName() != null ? req.getFullName() : req.getUsername());
        user.setGender(req.getGender() != null ? req.getGender() : "Other");
        user.setAge(req.getAge() != null ? req.getAge() : 25);
        user.setLocation(req.getLocation() != null ? req.getLocation() : "Neo Tokyo");
        user.setVibeArchetype(req.getVibeArchetype() != null ? req.getVibeArchetype() : "Cosmic Explorer");
        user.setRole("ROLE_USER");
        user.setIsOnline(true);
        user.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");

        if (req.getInterests() != null && !req.getInterests().isEmpty()) {
            user.setInterests(req.getInterests());
        } else {
            user.setInterests(Set.of("Cyberpunk", "Synthwave", "AI Art", "Coffee", "Tech"));
        }

        if (req.getHobbies() != null && !req.getHobbies().isEmpty()) {
            user.setHobbies(req.getHobbies());
        } else {
            user.setHobbies(Set.of("Coding", "Gaming", "Photography"));
        }

        if (req.getLanguages() != null && !req.getLanguages().isEmpty()) {
            user.setLanguages(req.getLanguages());
        } else {
            user.setLanguages(Set.of("English", "Japanese"));
        }

        user = userRepository.save(user);

        UserPreference pref = new UserPreference(user);
        preferenceRepository.save(pref);

        String token = tokenProvider.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    public AuthResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsernameOrEmail(), req.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsOnline(true);
        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    public UserDto getCurrentUserDto() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }

        User user = userRepository.findById(principal.getId()).orElse(null);
        return UserDto.fromEntity(user);
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("Not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Map<String, String>> getDemoAccounts() {
        return List.of(
            Map.of("username", "alex_vibe", "password", "password123", "role", "Tech Alchemist", "name", "Alex Rivera"),
            Map.of("username", "maya_cosmic", "password", "password123", "role", "Cosmic Dreamer", "name", "Maya Lin"),
            Map.of("username", "jordan_cyber", "password", "password123", "role", "Synthwave Producer", "name", "Jordan Vance"),
            Map.of("username", "admin", "password", "admin123", "role", "System Administrator", "name", "Admin Moderator")
        );
    }
}
