package com.vibematch.dto;

import com.vibematch.entity.FriendRequest;
import java.time.LocalDateTime;

public class SocialDto {

    public static class FriendRequestDto {
        private Long id;
        private UserDto sender;
        private UserDto receiver;
        private FriendRequest.Status status;
        private LocalDateTime createdAt;

        public FriendRequestDto() {}

        public static FriendRequestDto fromEntity(FriendRequest req) {
            FriendRequestDto dto = new FriendRequestDto();
            dto.setId(req.getId());
            dto.setSender(UserDto.fromEntity(req.getSender()));
            dto.setReceiver(UserDto.fromEntity(req.getReceiver()));
            dto.setStatus(req.getStatus());
            dto.setCreatedAt(req.getCreatedAt());
            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public UserDto getSender() { return sender; }
        public void setSender(UserDto sender) { this.sender = sender; }
        public UserDto getReceiver() { return receiver; }
        public void setReceiver(UserDto receiver) { this.receiver = receiver; }
        public FriendRequest.Status getStatus() { return status; }
        public void setStatus(FriendRequest.Status status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class FriendDto {
        private Long friendshipId;
        private UserDto friend;
        private LocalDateTime since;
        private String lastMessage;
        private LocalDateTime lastMessageTime;
        private long unreadCount;

        public FriendDto() {}

        public Long getFriendshipId() { return friendshipId; }
        public void setFriendshipId(Long friendshipId) { this.friendshipId = friendshipId; }
        public UserDto getFriend() { return friend; }
        public void setFriend(UserDto friend) { this.friend = friend; }
        public LocalDateTime getSince() { return since; }
        public void setSince(LocalDateTime since) { this.since = since; }
        public String getLastMessage() { return lastMessage; }
        public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
        public LocalDateTime getLastMessageTime() { return lastMessageTime; }
        public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }
        public long getUnreadCount() { return unreadCount; }
        public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
    }

    public static class ReportRequest {
        private Long reportedUserId;
        private String reason;
        private String details;

        public ReportRequest() {}
        public Long getReportedUserId() { return reportedUserId; }
        public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }

    public static class UserPreferenceDto {
        private Integer minAge;
        private Integer maxAge;
        private Integer maxDistanceKm;
        private Boolean ghostMode;
        private Boolean showReadReceipts;
        private Boolean showActiveStatus;
        private String profileVisibility;

        public UserPreferenceDto() {}

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
}
