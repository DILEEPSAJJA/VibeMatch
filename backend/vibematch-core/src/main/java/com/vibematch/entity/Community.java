package com.vibematch.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "communities")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    private String icon; // emoji or icon name
    private String banner;
    private String category; // "Tech & AI", "Music & Audio", "Gaming & Esports", "Creatives & Writers", "Fitness & Wellness"

    @Column(name = "member_count")
    private Integer memberCount = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "community_members", joinColumns = @JoinColumn(name = "community_id"))
    @Column(name = "user_id")
    private Set<Long> memberIds = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Community() {}

    public Community(String name, String description, String icon, String category) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }

    public Set<Long> getMemberIds() { return memberIds; }
    public void setMemberIds(Set<Long> memberIds) { 
        this.memberIds = memberIds; 
        this.memberCount = memberIds.size();
    }

    public void addMember(Long userId) {
        this.memberIds.add(userId);
        this.memberCount = this.memberIds.size();
    }

    public void removeMember(Long userId) {
        this.memberIds.remove(userId);
        this.memberCount = this.memberIds.size();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
