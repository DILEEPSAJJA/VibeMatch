package com.vibematch.dto;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class MatchDto {

    public static class MatchProfileDto {
        private UserDto user;
        private int matchPercentage;
        private Set<String> sharedInterests;
        private Set<String> sharedHobbies;
        private Set<String> sharedLanguages;
        private Map<String, Integer> scoreBreakdown; // "interests": 40, "vibe": 25, "hobbies": 20, "languages": 15
        private String compatibilityVerdict;
        private List<String> icebreakers;
        private String friendshipStatus; // NONE, PENDING_SENT, PENDING_RECEIVED, FRIENDS, BLOCKED
        private Long requestId; // if pending request exists

        public MatchProfileDto() {}

        public UserDto getUser() { return user; }
        public void setUser(UserDto user) { this.user = user; }

        public int getMatchPercentage() { return matchPercentage; }
        public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }

        public Set<String> getSharedInterests() { return sharedInterests; }
        public void setSharedInterests(Set<String> sharedInterests) { this.sharedInterests = sharedInterests; }

        public Set<String> getSharedHobbies() { return sharedHobbies; }
        public void setSharedHobbies(Set<String> sharedHobbies) { this.sharedHobbies = sharedHobbies; }

        public Set<String> getSharedLanguages() { return sharedLanguages; }
        public void setSharedLanguages(Set<String> sharedLanguages) { this.sharedLanguages = sharedLanguages; }

        public Map<String, Integer> getScoreBreakdown() { return scoreBreakdown; }
        public void setScoreBreakdown(Map<String, Integer> scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }

        public String getCompatibilityVerdict() { return compatibilityVerdict; }
        public void setCompatibilityVerdict(String compatibilityVerdict) { this.compatibilityVerdict = compatibilityVerdict; }

        public List<String> getIcebreakers() { return icebreakers; }
        public void setIcebreakers(List<String> icebreakers) { this.icebreakers = icebreakers; }

        public String getFriendshipStatus() { return friendshipStatus; }
        public void setFriendshipStatus(String friendshipStatus) { this.friendshipStatus = friendshipStatus; }

        public Long getRequestId() { return requestId; }
        public void setRequestId(Long requestId) { this.requestId = requestId; }
    }

    public static class DiscoveryFilterDto {
        private Integer minAge;
        private Integer maxAge;
        private String gender;
        private String location;
        private List<String> interests;
        private Integer minMatchScore;

        public DiscoveryFilterDto() {}

        public Integer getMinAge() { return minAge; }
        public void setMinAge(Integer minAge) { this.minAge = minAge; }

        public Integer getMaxAge() { return maxAge; }
        public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public List<String> getInterests() { return interests; }
        public void setInterests(List<String> interests) { this.interests = interests; }

        public Integer getMinMatchScore() { return minMatchScore; }
        public void setMinMatchScore(Integer minMatchScore) { this.minMatchScore = minMatchScore; }
    }
}
