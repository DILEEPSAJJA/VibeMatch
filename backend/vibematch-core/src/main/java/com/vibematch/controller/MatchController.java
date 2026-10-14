package com.vibematch.controller;

import com.vibematch.dto.MatchDto.*;
import com.vibematch.entity.User;
import com.vibematch.repository.UserRepository;
import com.vibematch.service.AuthService;
import com.vibematch.service.MatchAlgorithmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchAlgorithmService matchService;
    private final AuthService authService;
    private final UserRepository userRepository;

    public MatchController(MatchAlgorithmService matchService, AuthService authService, UserRepository userRepository) {
        this.matchService = matchService;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/discover")
    public ResponseEntity<List<MatchProfileDto>> discoverMatches(@RequestBody(required = false) DiscoveryFilterDto filter) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(matchService.discover(currentUser, filter));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<MatchProfileDto>> discoverMatchesGet(
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minMatchScore) {
        User currentUser = authService.getCurrentUser();
        DiscoveryFilterDto filter = new DiscoveryFilterDto();
        filter.setMinAge(minAge);
        filter.setMaxAge(maxAge);
        filter.setGender(gender);
        filter.setLocation(location);
        filter.setMinMatchScore(minMatchScore);
        return ResponseEntity.ok(matchService.discover(currentUser, filter));
    }

    @GetMapping("/{targetUserId}/compatibility")
    public ResponseEntity<MatchProfileDto> getCompatibility(@PathVariable Long targetUserId) {
        User currentUser = authService.getCurrentUser();
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUserId));
        return ResponseEntity.ok(matchService.computeMatchProfile(currentUser, target));
    }
}
