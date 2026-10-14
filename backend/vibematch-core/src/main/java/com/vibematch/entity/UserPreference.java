package com.vibematch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer minAge = 18;
    private Integer maxAge = 65;
    private Integer maxDistanceKm = 100;
    private Boolean ghostMode = false;
    private Boolean showReadReceipts = true;
    private Boolean showActiveStatus = true;
    private String profileVisibility = "PUBLIC"; // PUBLIC, FRIENDS_ONLY, PRIVATE

    public UserPreference() {}

    public UserPreference(User user) {
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getMinAge() { return minAge; }
    public void setMinAge(Integer minAge) { this.minAge = minAge; }

    public Integer getMaxAge() { return maxAge; }
    public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

    public Integer getMaxDistanceKm() { return maxDistanceKm; }
    public void setMaxDistanceKm(Integer maxDistanceKm) { this.maxDistanceKm = maxDistanceKm; }

    public Boolean getGhostMode() { return ghostMode; }
    public void setGhostMode(Boolean ghostMode) { this.ghostMode = ghostMode; }

    public Boolean getShowReadReceipts() { return showReadReceipts; }
    public void setShowReadReceipts(Boolean showReadReceipts) { this.showReadReceipts = showReadReceipts; }

    public Boolean getShowActiveStatus() { return showActiveStatus; }
    public void setShowActiveStatus(Boolean showActiveStatus) { this.showActiveStatus = showActiveStatus; }

    public String getProfileVisibility() { return profileVisibility; }
    public void setProfileVisibility(String profileVisibility) { this.profileVisibility = profileVisibility; }
}
