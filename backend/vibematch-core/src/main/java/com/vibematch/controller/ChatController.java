package com.vibematch.controller;

import com.vibematch.dto.ChatDto.*;
import com.vibematch.dto.SocialDto.FriendDto;
import com.vibematch.entity.User;
import com.vibematch.service.AuthService;
import com.vibematch.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final AuthService authService;

    public ChatController(ChatService chatService, AuthService authService) {
        this.chatService = chatService;
        this.authService = authService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<FriendDto>> getConversations() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(chatService.getRecentConversations(currentUser));
    }

    @GetMapping("/messages/{otherUserId}")
    public ResponseEntity<List<ChatMessageDto>> getConversation(@PathVariable Long otherUserId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(chatService.getConversation(currentUser, otherUserId));
    }

    @PostMapping("/messages/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            ChatMessageDto dto = chatService.sendMessage(currentUser, request);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/messages/reaction")
    public ResponseEntity<?> addReaction(@RequestBody ReactionRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(chatService.addReaction(currentUser, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/messages/read/{senderId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long senderId) {
        User currentUser = authService.getCurrentUser();
        chatService.markAsRead(currentUser, senderId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/icebreakers/{targetUserId}")
    public ResponseEntity<List<String>> getIcebreakers(@PathVariable Long targetUserId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(chatService.getIcebreakers(currentUser, targetUserId));
    }
}
