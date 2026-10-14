package com.vibematch.controller;

import com.vibematch.dto.SocialDto.UserPreferenceDto;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.User;
import com.vibematch.service.AuthService;
import com.vibematch.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto updateDto) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), updateDto));
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferenceDto> getPreferences() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(userService.getPreferences(currentUser.getId()));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserPreferenceDto> updatePreferences(@RequestBody UserPreferenceDto dto) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(userService.updatePreferences(currentUser.getId(), dto));
    }

    @PostMapping("/status")
    public ResponseEntity<?> setOnlineStatus(@RequestBody Map<String, Boolean> body) {
        User currentUser = authService.getCurrentUser();
        boolean isOnline = Boolean.TRUE.equals(body.get("isOnline"));
        userService.updateOnlineStatus(currentUser.getId(), isOnline);
        return ResponseEntity.ok(Map.of("success", true, "isOnline", isOnline));
    }
}
