package com.vibematch.service;

import com.vibematch.dto.MatchDto.*;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.FriendRequest;
import com.vibematch.entity.User;
import com.vibematch.repository.BlockedUserRepository;
import com.vibematch.repository.FriendRequestRepository;
import com.vibematch.repository.FriendshipRepository;
import com.vibematch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchAlgorithmService {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final BlockedUserRepository blockedUserRepository;

    public MatchAlgorithmService(UserRepository userRepository,
                                 FriendshipRepository friendshipRepository,
                                 FriendRequestRepository friendRequestRepository,
                                 BlockedUserRepository blockedUserRepository) {
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.blockedUserRepository = blockedUserRepository;
    }

    public MatchProfileDto computeMatchProfile(User currentUser, User targetUser) {
        MatchProfileDto dto = new MatchProfileDto();
        dto.setUser(UserDto.fromEntity(targetUser));

        Set<String> u1Interests = currentUser.getInterests() != null ? currentUser.getInterests() : Collections.emptySet();
        Set<String> u2Interests = targetUser.getInterests() != null ? targetUser.getInterests() : Collections.emptySet();

        Set<String> sharedInterests = new HashSet<>(u1Interests);
        sharedInterests.retainAll(u2Interests);
        dto.setSharedInterests(sharedInterests);

        Set<String> u1Hobbies = currentUser.getHobbies() != null ? currentUser.getHobbies() : Collections.emptySet();
        Set<String> u2Hobbies = targetUser.getHobbies() != null ? targetUser.getHobbies() : Collections.emptySet();

        Set<String> sharedHobbies = new HashSet<>(u1Hobbies);
        sharedHobbies.retainAll(u2Hobbies);
        dto.setSharedHobbies(sharedHobbies);

        Set<String> u1Languages = currentUser.getLanguages() != null ? currentUser.getLanguages() : Collections.emptySet();
        Set<String> u2Languages = targetUser.getLanguages() != null ? targetUser.getLanguages() : Collections.emptySet();

        Set<String> sharedLanguages = new HashSet<>(u1Languages);
        sharedLanguages.retainAll(u2Languages);
        dto.setSharedLanguages(sharedLanguages);

        // 1. Interest Score (up to 40 pts)
        double interestScore = 0;
        Set<String> unionInterests = new HashSet<>(u1Interests);
        unionInterests.addAll(u2Interests);
        if (!unionInterests.isEmpty()) {
            interestScore = ((double) sharedInterests.size() / unionInterests.size()) * 40.0;
        }

        // 2. Hobby Score (up to 20 pts)
        double hobbyScore = 0;
        Set<String> unionHobbies = new HashSet<>(u1Hobbies);
        unionHobbies.addAll(u2Hobbies);
        if (!unionHobbies.isEmpty()) {
            hobbyScore = ((double) sharedHobbies.size() / unionHobbies.size()) * 20.0;
        }

        // 3. Language Score (up to 15 pts)
        double langScore = 0;
        if (!sharedLanguages.isEmpty()) {
            langScore = Math.min(15.0, sharedLanguages.size() * 7.5);
        }

        // 4. Vibe Archetype Affinity (up to 25 pts)
        double vibeScore = computeVibeAffinity(currentUser.getVibeArchetype(), targetUser.getVibeArchetype());

        // Baseline organic resonance bonus
        double baseResonance = 10.0;

        int totalScore = (int) Math.round(interestScore + hobbyScore + langScore + vibeScore + baseResonance);
        totalScore = Math.max(50, Math.min(99, totalScore));
        dto.setMatchPercentage(totalScore);

        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("interests", (int) Math.round(interestScore));
        breakdown.put("vibe", (int) Math.round(vibeScore));
        breakdown.put("hobbies", (int) Math.round(hobbyScore));
        breakdown.put("languages", (int) Math.round(langScore));
        dto.setScoreBreakdown(breakdown);

        // Compatibility Verdict
        dto.setCompatibilityVerdict(generateVerdict(totalScore));

        // Icebreakers
        dto.setIcebreakers(generateIcebreakers(targetUser, sharedInterests, sharedHobbies));

        // Friendship status
        determineFriendshipStatus(currentUser, targetUser, dto);

        return dto;
    }

    private double computeVibeAffinity(String v1, String v2) {
        if (v1 == null || v2 == null) return 15.0;
        if (v1.equalsIgnoreCase(v2)) return 25.0;

        // Complementary archetypes
        String combo = (v1 + "+" + v2).toLowerCase();
        if (combo.contains("tech") && combo.contains("cosmic") ||
            combo.contains("synthwave") && combo.contains("night owl") ||
            combo.contains("creative") && combo.contains("dreamer")) {
            return 22.0;
        }
        return 16.0;
    }

    private String generateVerdict(int score) {
        if (score >= 92) return "✨ Stellar Quantum Resonance — Rare Soul Alignment";
        if (score >= 82) return "💜 High Harmonic Synergy — Electric Creative Flow";
        if (score >= 72) return "🔮 Vibrant Wavelength Match — Great Shared Frequency";
        return "🌱 Intriguing Dynamic — Fascinating Complementary Perspectives";
    }

    public List<String> generateIcebreakers(User targetUser, Set<String> sharedInterests, Set<String> sharedHobbies) {
        List<String> starters = new ArrayList<>();

        if (sharedInterests != null && !sharedInterests.isEmpty()) {
            for (String interest : sharedInterests) {
                if (interest.equalsIgnoreCase("Synthwave") || interest.equalsIgnoreCase("Music")) {
                    starters.add("What's the best synthwave or cyberpunk track on your current rotation?");
                } else if (interest.equalsIgnoreCase("Cyberpunk") || interest.equalsIgnoreCase("Sci-Fi")) {
                    starters.add("Blade Runner, Neuromancer, or Ghost in the Shell — which universe would you visit for a weekend?");
                } else if (interest.equalsIgnoreCase("AI Art") || interest.equalsIgnoreCase("Tech")) {
                    starters.add("What's the coolest AI experiment or future tech demo you've seen recently?");
                } else if (interest.equalsIgnoreCase("Coffee") || interest.equalsIgnoreCase("Cafes")) {
                    starters.add("What's your ultimate coffee brewing setup or favorite dark aesthetic café?");
                } else if (interest.equalsIgnoreCase("Fitness") || interest.equalsIgnoreCase("Yoga")) {
                    starters.add("How do you keep your physical energy in sync with creative grind?");
                }
            }
        }

        if (sharedHobbies != null && !sharedHobbies.isEmpty()) {
            for (String hobby : sharedHobbies) {
                if (hobby.equalsIgnoreCase("Gaming")) {
                    starters.add("What game has completely hooked you with its story and world design?");
                } else if (hobby.equalsIgnoreCase("Photography")) {
                    starters.add("Do you prefer golden hour film photography or neon nighttime street shots?");
                }
            }
        }

        // Generic fallback icebreakers
        if (starters.isEmpty()) {
            starters.add("If you could teleport to any city tonight for a late-night adventure, where are we going?");
            starters.add("What's a rabbit hole or niche topic you've been obsessing over recently?");
            starters.add("How did you decide on the '" + (targetUser.getVibeArchetype() != null ? targetUser.getVibeArchetype() : "Mystic Explorer") + "' archetype?");
        }

        return starters.stream().distinct().limit(3).collect(Collectors.toList());
    }

    private void determineFriendshipStatus(User currentUser, User targetUser, MatchProfileDto dto) {
        if (blockedUserRepository.isBlockedEitherWay(currentUser, targetUser)) {
            dto.setFriendshipStatus("BLOCKED");
            return;
        }

        if (friendshipRepository.areFriends(currentUser, targetUser)) {
            dto.setFriendshipStatus("FRIENDS");
            return;
        }

        Optional<FriendRequest> sent = friendRequestRepository.findBySenderAndReceiverAndStatus(
                currentUser, targetUser, FriendRequest.Status.PENDING);
        if (sent.isPresent()) {
            dto.setFriendshipStatus("PENDING_SENT");
            dto.setRequestId(sent.get().getId());
            return;
        }

        Optional<FriendRequest> received = friendRequestRepository.findBySenderAndReceiverAndStatus(
                targetUser, currentUser, FriendRequest.Status.PENDING);
        if (received.isPresent()) {
            dto.setFriendshipStatus("PENDING_RECEIVED");
            dto.setRequestId(received.get().getId());
            return;
        }

        dto.setFriendshipStatus("NONE");
    }

    public List<MatchProfileDto> discover(User currentUser, DiscoveryFilterDto filter) {
        List<User> potentialUsers = userRepository.findPotentialMatches(currentUser.getId());

        return potentialUsers.stream()
                .filter(u -> !blockedUserRepository.isBlockedEitherWay(currentUser, u))
                .filter(u -> {
                    if (filter == null) return true;
                    if (filter.getGender() != null && !filter.getGender().equalsIgnoreCase("all") && !filter.getGender().equalsIgnoreCase(u.getGender())) {
                        return false;
                    }
                    if (filter.getMinAge() != null && u.getAge() != null && u.getAge() < filter.getMinAge()) {
                        return false;
                    }
                    if (filter.getMaxAge() != null && u.getAge() != null && u.getAge() > filter.getMaxAge()) {
                        return false;
                    }
                    if (filter.getLocation() != null && !filter.getLocation().isBlank() && u.getLocation() != null &&
                        !u.getLocation().toLowerCase().contains(filter.getLocation().toLowerCase())) {
                        return false;
                    }
                    if (filter.getInterests() != null && !filter.getInterests().isEmpty()) {
                        boolean hasCommon = u.getInterests() != null && u.getInterests().stream().anyMatch(filter.getInterests()::contains);
                        if (!hasCommon) return false;
                    }
                    return true;
                })
                .map(target -> computeMatchProfile(currentUser, target))
                .filter(dto -> filter == null || filter.getMinMatchScore() == null || dto.getMatchPercentage() >= filter.getMinMatchScore())
                .sorted(Comparator.comparingInt(MatchProfileDto::getMatchPercentage).reversed())
                .collect(Collectors.toList());
    }
}
