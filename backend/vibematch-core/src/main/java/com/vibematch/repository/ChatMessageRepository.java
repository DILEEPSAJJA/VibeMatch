package com.vibematch.repository;

import com.vibematch.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :user1 AND m.receiverId = :user2) OR " +
           "(m.senderId = :user2 AND m.receiverId = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversation(@Param("user1") Long user1, @Param("user2") Long user2);

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :userId OR m.receiverId = :userId) " +
           "ORDER BY m.createdAt DESC")
    List<ChatMessage> findAllInvolvingUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiverId = :userId AND m.senderId = :senderId AND m.isRead = false")
    long countUnreadFromSender(@Param("userId") Long userId, @Param("senderId") Long senderId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true, m.readAt = :readAt " +
           "WHERE m.receiverId = :userId AND m.senderId = :senderId AND m.isRead = false")
    void markConversationAsRead(@Param("userId") Long userId, @Param("senderId") Long senderId, @Param("readAt") LocalDateTime readAt);

    long countByCreatedAtAfter(LocalDateTime time);
}
