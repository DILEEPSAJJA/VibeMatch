package com.vibematch.websocket;

import com.vibematch.dto.ChatDto.*;
import com.vibematch.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles typing notifications between users in real time.
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingNotification typing) {
        if (typing.getReceiverId() != null) {
            messagingTemplate.convertAndSend("/topic/typing/" + typing.getReceiverId(), typing);
        }
    }

    /**
     * Handles WebRTC signaling for audio and video calls.
     * Transmits OFFER, ANSWER, ICE_CANDIDATE, CALL_REQUEST, CALL_ACCEPT, CALL_DECLINE, CALL_END.
     */
    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload WebRtcSignalDto signal) {
        if (signal.getReceiverId() != null) {
            log.info("Relaying WebRTC call signal [{}] from {} to {}", signal.getType(), signal.getSenderId(), signal.getReceiverId());
            messagingTemplate.convertAndSend("/topic/calls/" + signal.getReceiverId(), signal);
        }
    }
}
