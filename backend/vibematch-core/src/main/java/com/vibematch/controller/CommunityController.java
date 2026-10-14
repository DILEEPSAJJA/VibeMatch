package com.vibematch.controller;

import com.vibematch.dto.ExtraDto.*;
import com.vibematch.entity.User;
import com.vibematch.service.AuthService;
import com.vibematch.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;
    private final AuthService authService;

    public CommunityController(CommunityService communityService, AuthService authService) {
        this.communityService = communityService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<CommunityDto>> getAllCommunities() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(communityService.getAllCommunities(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunity(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(communityService.getCommunity(id, currentUser.getId()));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<CommunityDto> joinCommunity(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(communityService.joinCommunity(id, currentUser.getId()));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<CommunityDto> leaveCommunity(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(communityService.leaveCommunity(id, currentUser.getId()));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<List<CommunityPostDto>> getPosts(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getPosts(id));
    }

    @PostMapping("/{id}/posts")
    public ResponseEntity<CommunityPostDto> createPost(@PathVariable Long id, @RequestBody CreatePostRequest req) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(communityService.createPost(id, currentUser, req.getContent()));
    }
}
