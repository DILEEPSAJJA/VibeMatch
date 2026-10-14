package com.vibematch.dto;

import com.vibematch.entity.ChatMessage;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChatDto {

    public static class ChatMessageDto {
        private Long id;
        private Long senderId;
        private Long receiverId;
        private String content;
        private String messageType;
        private String mediaUrl;
        private String mediaMeta;
        private Boolean isRead;
        private LocalDateTime readAt;
        private LocalDateTime createdAt;
        private List<ReactionDto> reactions = new ArrayList<>();

        public ChatMessageDto() {}

        public static ChatMessageDto fromEntity(ChatMessage msg) {
            ChatMessageDto dto = new ChatMessageDto();
            dto.setId(msg.getId());
            dto.setSenderId(msg.getSenderId());
            dto.setReceiverId(msg.getReceiverId());
            dto.setContent(msg.getContent());
            dto.setMessageType(msg.getMessageType().name());
            dto.setMediaUrl(msg.getMediaUrl());
            dto.setMediaMeta(msg.getMediaMeta());
            dto.setIsRead(msg.getIsRead());
            dto.setReadAt(msg.getReadAt());
            dto.setCreatedAt(msg.getCreatedAt());
            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getMessageType() { return messageType; }
        public void setMessageType(String messageType) { this.messageType = messageType; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public String getMediaMeta() { return mediaMeta; }
        public void setMediaMeta(String mediaMeta) { this.mediaMeta = mediaMeta; }
        public Boolean getIsRead() { return isRead; }
        public void setIsRead(Boolean isRead) { this.isRead = isRead; }
        public LocalDateTime getReadAt() { return readAt; }
        public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<ReactionDto> getReactions() { return reactions; }
        public void setReactions(List<ReactionDto> reactions) { this.reactions = reactions; }
    }

    public static class ReactionDto {
        private Long id;
        private Long messageId;
        private Long userId;
        private String emoji;

        public ReactionDto() {}
        public ReactionDto(Long id, Long messageId, Long userId, String emoji) {
            this.id = id;
            this.messageId = messageId;
            this.userId = userId;
            this.emoji = emoji;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getMessageId() { return messageId; }
        public void setMessageId(Long messageId) { this.messageId = messageId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getEmoji() { return emoji; }
        public void setEmoji(String emoji) { this.emoji = emoji; }
    }

    public static class SendMessageRequest {
        private Long receiverId;
        private String content;
        private String messageType = "TEXT";
        private String mediaUrl;
        private String mediaMeta;

        public SendMessageRequest() {}
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getMessageType() { return messageType; }
        public void setMessageType(String messageType) { this.messageType = messageType; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public String getMediaMeta() { return mediaMeta; }
        public void setMediaMeta(String mediaMeta) { this.mediaMeta = mediaMeta; }
    }

    public static class ReactionRequest {
        private Long messageId;
        private String emoji;

        public ReactionRequest() {}
        public Long getMessageId() { return messageId; }
        public void setMessageId(Long messageId) { this.messageId = messageId; }
        public String getEmoji() { return emoji; }
        public void setEmoji(String emoji) { this.emoji = emoji; }
    }

    public static class TypingNotification {
        private Long senderId;
        private Long receiverId;
        private Boolean isTyping;

        public TypingNotification() {}
        public TypingNotification(Long senderId, Long receiverId, Boolean isTyping) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.isTyping = isTyping;
        }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public Boolean getIsTyping() { return isTyping; }
        public void setIsTyping(Boolean isTyping) { this.isTyping = isTyping; }
    }

    public static class WebRtcSignalDto {
        private String type; // OFFER, ANSWER, ICE_CANDIDATE, CALL_REQUEST, CALL_ACCEPT, CALL_DECLINE, CALL_END
        private Long senderId;
        private Long receiverId;
        private String senderName;
        private String senderAvatar;
        private String callType; // AUDIO, VIDEO
        private Object payload; // SDP or IceCandidate object
        private long timestamp = System.currentTimeMillis();

        public WebRtcSignalDto() {}

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getSenderAvatar() { return senderAvatar; }
        public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }
        public String getCallType() { return callType; }
        public void setCallType(String callType) { this.callType = callType; }
        public Object getPayload() { return payload; }
        public void setPayload(Object payload) { this.payload = payload; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }
}
