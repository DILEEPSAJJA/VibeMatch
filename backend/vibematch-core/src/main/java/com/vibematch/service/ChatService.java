package com.vibematch.service;

import com.vibematch.dto.ChatDto.*;
import com.vibematch.dto.SocialDto.FriendDto;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.ChatMessage;
import com.vibematch.entity.MessageReaction;
import com.vibematch.entity.Notification;
import com.vibematch.entity.User;
import com.vibematch.repository.BlockedUserRepository;
import com.vibematch.repository.ChatMessageRepository;
import com.vibematch.repository.MessageReactionRepository;
import com.vibematch.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatMessageRepository chatMessageRepository;
    private final MessageReactionRepository messageReactionRepository;
    private final UserRepository userRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final NotificationService notificationService;
    private final MatchAlgorithmService matchAlgorithmService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       MessageReactionRepository messageReactionRepository,
                       UserRepository userRepository,
                       BlockedUserRepository blockedUserRepository,
                       NotificationService notificationService,
                       MatchAlgorithmService matchAlgorithmService,
                       @Autowired(required = false) SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.messageReactionRepository = messageReactionRepository;
        this.userRepository = userRepository;
        this.blockedUserRepository = blockedUserRepository;
        this.notificationService = notificationService;
        this.matchAlgorithmService = matchAlgorithmService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public ChatMessageDto sendMessage(User sender, SendMessageRequest req) {
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        if (blockedUserRepository.isBlockedEitherWay(sender, receiver)) {
            throw new IllegalStateException("Cannot send message to this user");
        }

        ChatMessage.MessageType type = ChatMessage.MessageType.TEXT;
        if (req.getMessageType() != null) {
            try {
                type = ChatMessage.MessageType.valueOf(req.getMessageType().toUpperCase());
            } catch (Exception ignored) {}
        }

        ChatMessage message = new ChatMessage(sender.getId(), receiver.getId(), req.getContent(), type);
        message.setMediaUrl(req.getMediaUrl());
        message.setMediaMeta(req.getMediaMeta());
        message = chatMessageRepository.save(message);

        ChatMessageDto dto = ChatMessageDto.fromEntity(message);

        // Send via WebSocket STOMP to both participants
        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), dto);
                messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), dto);
            } catch (Exception e) {
                log.warn("WebSocket dispatch failed: {}", e.getMessage());
            }
        }

        // Send in-app notification to receiver
        notificationService.createAndSend(
                receiver.getId(),
                sender.getId(),
                Notification.Type.CHAT_MESSAGE,
                "New message from " + sender.getFullName(),
                type == ChatMessage.MessageType.TEXT ? req.getContent() : "Sent a " + type.name().toLowerCase(),
                sender.getId().toString()
        );

        return dto;
    }

    @Transactional
    public List<ChatMessageDto> getConversation(User currentUser, Long otherUserId) {
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (blockedUserRepository.isBlockedEitherWay(currentUser, other)) {
            return Collections.emptyList();
        }

        // Mark incoming messages as read
        chatMessageRepository.markConversationAsRead(currentUser.getId(), otherUserId, LocalDateTime.now());

        List<ChatMessage> messages = chatMessageRepository.findConversation(currentUser.getId(), otherUserId);
        if (messages.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> messageIds = messages.stream().map(ChatMessage::getId).collect(Collectors.toList());
        List<MessageReaction> allReactions = messageReactionRepository.findByMessageIdIn(messageIds);

        Map<Long, List<ReactionDto>> reactionsByMsgId = new HashMap<>();
        for (MessageReaction r : allReactions) {
            reactionsByMsgId.computeIfAbsent(r.getMessageId(), k -> new ArrayList<>())
                    .add(new ReactionDto(r.getId(), r.getMessageId(), r.getUserId(), r.getEmoji()));
        }

        return messages.stream().map(m -> {
            ChatMessageDto dto = ChatMessageDto.fromEntity(m);
            dto.setReactions(reactionsByMsgId.getOrDefault(m.getId(), Collections.emptyList()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ReactionDto addReaction(User user, ReactionRequest req) {
        ChatMessage message = chatMessageRepository.findById(req.getMessageId())
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        // Delete existing reaction from this user on this message if any
        messageReactionRepository.findByMessageIdAndUserId(message.getId(), user.getId())
                .ifPresent(messageReactionRepository::delete);

        MessageReaction reaction = new MessageReaction(message.getId(), user.getId(), req.getEmoji());
        reaction = messageReactionRepository.save(reaction);

        ReactionDto dto = new ReactionDto(reaction.getId(), reaction.getMessageId(), reaction.getUserId(), reaction.getEmoji());

        // Notify both sides via WebSocket
        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/reactions/" + message.getSenderId(), dto);
                messagingTemplate.convertAndSend("/topic/reactions/" + message.getReceiverId(), dto);
            } catch (Exception e) {
                log.warn("WebSocket reaction dispatch error: {}", e.getMessage());
            }
        }

        return dto;
    }

    @Transactional
    public void markAsRead(User currentUser, Long senderId) {
        chatMessageRepository.markConversationAsRead(currentUser.getId(), senderId, LocalDateTime.now());

        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/read/" + senderId, Map.of(
                        "readerId", currentUser.getId(),
                        "readAt", LocalDateTime.now().toString()
                ));
            } catch (Exception ignored) {}
        }
    }

    public List<FriendDto> getRecentConversations(User currentUser) {
        List<ChatMessage> allMsgs = chatMessageRepository.findAllInvolvingUser(currentUser.getId());
        Map<Long, ChatMessage> latestByPartner = new LinkedHashMap<>();

        for (ChatMessage m : allMsgs) {
            Long partnerId = m.getSenderId().equals(currentUser.getId()) ? m.getReceiverId() : m.getSenderId();
            latestByPartner.putIfAbsent(partnerId, m);
        }

        List<FriendDto> list = new ArrayList<>();
        for (Map.Entry<Long, ChatMessage> entry : latestByPartner.entrySet()) {
            Long partnerId = entry.getKey();
            ChatMessage last = entry.getValue();

            User partner = userRepository.findById(partnerId).orElse(null);
            if (partner == null || Boolean.TRUE.equals(partner.getIsBanned())) continue;
            if (blockedUserRepository.isBlockedEitherWay(currentUser, partner)) continue;

            FriendDto dto = new FriendDto();
            dto.setFriend(UserDto.fromEntity(partner));
            dto.setLastMessage(last.getMessageType() == ChatMessage.MessageType.TEXT ? last.getContent() : "[" + last.getMessageType() + "]");
            dto.setLastMessageTime(last.getCreatedAt());
            dto.setUnreadCount(chatMessageRepository.countUnreadFromSender(currentUser.getId(), partnerId));
            list.add(dto);
        }

        return list;
    }

    public List<String> getIcebreakers(User currentUser, Long targetUserId) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Set<String> sharedInterests = new HashSet<>(currentUser.getInterests() != null ? currentUser.getInterests() : Collections.emptySet());
        sharedInterests.retainAll(target.getInterests() != null ? target.getInterests() : Collections.emptySet());

        Set<String> sharedHobbies = new HashSet<>(currentUser.getHobbies() != null ? currentUser.getHobbies() : Collections.emptySet());
        sharedHobbies.retainAll(target.getHobbies() != null ? target.getHobbies() : Collections.emptySet());

        return matchAlgorithmService.generateIcebreakers(target, sharedInterests, sharedHobbies);
    }
}
