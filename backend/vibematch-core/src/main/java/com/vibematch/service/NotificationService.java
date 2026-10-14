package com.vibematch.service;

import com.vibematch.dto.ExtraDto.NotificationDto;
import com.vibematch.entity.Notification;
import com.vibematch.entity.User;
import com.vibematch.repository.NotificationRepository;
import com.vibematch.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               @Autowired(required = false) SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationDto createAndSend(Long userId, Long actorId, Notification.Type type, String title, String message, String referenceId) {
        String actorName = "VibeMatch";
        String actorAvatar = null;
        if (actorId != null) {
            User actor = userRepository.findById(actorId).orElse(null);
            if (actor != null) {
                actorName = actor.getFullName() != null ? actor.getFullName() : actor.getUsername();
                actorAvatar = actor.getAvatarUrl();
            }
        }

        Notification notification = new Notification(userId, actorId, actorName, actorAvatar, type, title, message, referenceId);
        notification = notificationRepository.save(notification);

        NotificationDto dto = NotificationDto.fromEntity(notification);

        // Real-time WebSocket delivery
        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/notifications/" + userId, dto);
            } catch (Exception e) {
                log.warn("Could not dispatch notification via WebSocket: {}", e.getMessage());
            }
        }

        return dto;
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }
}
