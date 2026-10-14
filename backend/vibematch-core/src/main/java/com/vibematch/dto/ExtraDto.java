package com.vibematch.dto;

import com.vibematch.entity.Community;
import com.vibematch.entity.CommunityPost;
import com.vibematch.entity.Notification;
import java.time.LocalDateTime;

public class ExtraDto {

    public static class CommunityDto {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String banner;
        private String category;
        private Integer memberCount;
        private Boolean isMember;
        private LocalDateTime createdAt;

        public CommunityDto() {}

        public static CommunityDto fromEntity(Community c, Long currentUserId) {
            CommunityDto dto = new CommunityDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setDescription(c.getDescription());
            dto.setIcon(c.getIcon());
            dto.setBanner(c.getBanner());
            dto.setCategory(c.getCategory());
            dto.setMemberCount(c.getMemberCount());
            dto.setIsMember(currentUserId != null && c.getMemberIds().contains(currentUserId));
            dto.setCreatedAt(c.getCreatedAt());
            return dto;
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
        public Boolean getIsMember() { return isMember; }
        public void setIsMember(Boolean isMember) { this.isMember = isMember; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class CommunityPostDto {
        private Long id;
        private Long communityId;
        private Long authorId;
        private String authorName;
        private String authorAvatar;
        private String content;
        private Integer likesCount;
        private LocalDateTime createdAt;

        public CommunityPostDto() {}

        public static CommunityPostDto fromEntity(CommunityPost p) {
            CommunityPostDto dto = new CommunityPostDto();
            dto.setId(p.getId());
            dto.setCommunityId(p.getCommunityId());
            dto.setAuthorId(p.getAuthorId());
            dto.setAuthorName(p.getAuthorName());
            dto.setAuthorAvatar(p.getAuthorAvatar());
            dto.setContent(p.getContent());
            dto.setLikesCount(p.getLikesCount());
            dto.setCreatedAt(p.getCreatedAt());
            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCommunityId() { return communityId; }
        public void setCommunityId(Long communityId) { this.communityId = communityId; }
        public Long getAuthorId() { return authorId; }
        public void setAuthorId(Long authorId) { this.authorId = authorId; }
        public String getAuthorName() { return authorName; }
        public void setAuthorName(String authorName) { this.authorName = authorName; }
        public String getAuthorAvatar() { return authorAvatar; }
        public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Integer getLikesCount() { return likesCount; }
        public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class CreatePostRequest {
        private String content;
        public CreatePostRequest() {}
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class NotificationDto {
        private Long id;
        private Long userId;
        private Long actorId;
        private String actorName;
        private String actorAvatar;
        private String type;
        private String title;
        private String message;
        private String referenceId;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public NotificationDto() {}

        public static NotificationDto fromEntity(Notification n) {
            NotificationDto dto = new NotificationDto();
            dto.setId(n.getId());
            dto.setUserId(n.getUserId());
            dto.setActorId(n.getActorId());
            dto.setActorName(n.getActorName());
            dto.setActorAvatar(n.getActorAvatar());
            dto.setType(n.getType().name());
            dto.setTitle(n.getTitle());
            dto.setMessage(n.getMessage());
            dto.setReferenceId(n.getReferenceId());
            dto.setIsRead(n.getIsRead());
            dto.setCreatedAt(n.getCreatedAt());
            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getActorId() { return actorId; }
        public void setActorId(Long actorId) { this.actorId = actorId; }
        public String getActorName() { return actorName; }
        public void setActorName(String actorName) { this.actorName = actorName; }
        public String getActorAvatar() { return actorAvatar; }
        public void setActorAvatar(String actorAvatar) { this.actorAvatar = actorAvatar; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getReferenceId() { return referenceId; }
        public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
        public Boolean getIsRead() { return isRead; }
        public void setIsRead(Boolean isRead) { this.isRead = isRead; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class AdminMetricsDto {
        private long totalUsers;
        private long activeUsersOnline;
        private long totalMatchesMade;
        private long totalMessagesExchanged;
        private long pendingReportsCount;
        private long totalCommunities;

        public AdminMetricsDto() {}

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getActiveUsersOnline() { return activeUsersOnline; }
        public void setActiveUsersOnline(long activeUsersOnline) { this.activeUsersOnline = activeUsersOnline; }
        public long getTotalMatchesMade() { return totalMatchesMade; }
        public void setTotalMatchesMade(long totalMatchesMade) { this.totalMatchesMade = totalMatchesMade; }
        public long getTotalMessagesExchanged() { return totalMessagesExchanged; }
        public void setTotalMessagesExchanged(long totalMessagesExchanged) { this.totalMessagesExchanged = totalMessagesExchanged; }
        public long getPendingReportsCount() { return pendingReportsCount; }
        public void setPendingReportsCount(long pendingReportsCount) { this.pendingReportsCount = pendingReportsCount; }
        public long getTotalCommunities() { return totalCommunities; }
        public void setTotalCommunities(long totalCommunities) { this.totalCommunities = totalCommunities; }
    }
}
