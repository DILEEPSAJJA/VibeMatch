package com.vibematch.controller;

import com.vibematch.dto.SocialDto.*;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.User;
import com.vibematch.service.AuthService;
import com.vibematch.service.SocialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final SocialService socialService;
    private final AuthService authService;

    public SocialController(SocialService socialService, AuthService authService) {
        this.socialService = socialService;
        this.authService = authService;
    }

    @GetMapping("/friends")
    public ResponseEntity<List<FriendDto>> getFriends() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(socialService.getFriends(currentUser));
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<List<FriendRequestDto>> getIncomingRequests() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(socialService.getIncomingRequests(currentUser));
    }

    @GetMapping("/requests/outgoing")
    public ResponseEntity<List<FriendRequestDto>> getOutgoingRequests() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(socialService.getOutgoingRequests(currentUser));
    }

    @PostMapping("/requests/send/{receiverId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable Long receiverId) {
        try {
            User currentUser = authService.getCurrentUser();
            FriendRequestDto dto = socialService.sendFriendRequest(currentUser, receiverId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long requestId) {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(socialService.acceptFriendRequest(currentUser, requestId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long requestId) {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(socialService.rejectFriendRequest(currentUser, requestId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{requestId}/withdraw")
    public ResponseEntity<?> withdrawFriendRequest(@PathVariable Long requestId) {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(socialService.withdrawFriendRequest(currentUser, requestId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/block/{targetUserId}")
    public ResponseEntity<?> blockUser(@PathVariable Long targetUserId) {
        User currentUser = authService.getCurrentUser();
        socialService.blockUser(currentUser, targetUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "User blocked successfully"));
    }

    @PostMapping("/unblock/{targetUserId}")
    public ResponseEntity<?> unblockUser(@PathVariable Long targetUserId) {
        User currentUser = authService.getCurrentUser();
        socialService.unblockUser(currentUser, targetUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "User unblocked successfully"));
    }

    @GetMapping("/blocked")
    public ResponseEntity<List<UserDto>> getBlockedUsers() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(socialService.getBlockedUsers(currentUser));
    }

    @PostMapping("/report")
    public ResponseEntity<?> reportUser(@RequestBody ReportRequest req) {
        User currentUser = authService.getCurrentUser();
        socialService.reportUser(currentUser, req);
        return ResponseEntity.ok(Map.of("success", true, "message", "Report submitted for moderation"));
    }
}
