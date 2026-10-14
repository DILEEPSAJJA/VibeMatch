package com.vibematch.service;

import com.vibematch.dto.SocialDto.*;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.*;
import com.vibematch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SocialService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final ReportRepository reportRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationService notificationService;

    public SocialService(UserRepository userRepository,
                         FriendRequestRepository friendRequestRepository,
                         FriendshipRepository friendshipRepository,
                         BlockedUserRepository blockedUserRepository,
                         ReportRepository reportRepository,
                         ChatMessageRepository chatMessageRepository,
                         NotificationService notificationService) {
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
        this.blockedUserRepository = blockedUserRepository;
        this.reportRepository = reportRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public FriendRequestDto sendFriendRequest(User sender, Long receiverId) {
        if (sender.getId().equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        if (blockedUserRepository.isBlockedEitherWay(sender, receiver)) {
            throw new IllegalStateException("Cannot connect with this user");
        }

        if (friendshipRepository.areFriends(sender, receiver)) {
            throw new IllegalStateException("Already friends");
        }

        // Check if there is already a pending request
        friendRequestRepository.findBySenderAndReceiverAndStatus(sender, receiver, FriendRequest.Status.PENDING)
                .ifPresent(r -> { throw new IllegalStateException("Friend request already sent"); });

        // If reverse request is already pending, auto-accept it!
        var reverseReq = friendRequestRepository.findBySenderAndReceiverAndStatus(receiver, sender, FriendRequest.Status.PENDING);
        if (reverseReq.isPresent()) {
            return acceptFriendRequest(sender, reverseReq.get().getId());
        }

        FriendRequest request = new FriendRequest(sender, receiver);
        request = friendRequestRepository.save(request);

        notificationService.createAndSend(
                receiver.getId(),
                sender.getId(),
                Notification.Type.FRIEND_REQUEST,
                "New Vibe Match Request",
                sender.getFullName() + " wants to connect with you!",
                request.getId().toString()
        );

        return FriendRequestDto.fromEntity(request);
    }

    @Transactional
    public FriendRequestDto acceptFriendRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Not authorized to accept this request");
        }

        if (request.getStatus() != FriendRequest.Status.PENDING) {
            throw new IllegalStateException("Request is already " + request.getStatus());
        }

        request.setStatus(FriendRequest.Status.ACCEPTED);
        request = friendRequestRepository.save(request);

        Friendship friendship = new Friendship(request.getSender(), request.getReceiver());
        friendshipRepository.save(friendship);

        notificationService.createAndSend(
                request.getSender().getId(),
                currentUser.getId(),
                Notification.Type.REQUEST_ACCEPTED,
                "Friend Request Accepted!",
                currentUser.getFullName() + " accepted your vibe match request. Start chatting now!",
                currentUser.getId().toString()
        );

        return FriendRequestDto.fromEntity(request);
    }

    @Transactional
    public FriendRequestDto rejectFriendRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Not authorized to reject this request");
        }

        request.setStatus(FriendRequest.Status.REJECTED);
        request = friendRequestRepository.save(request);
        return FriendRequestDto.fromEntity(request);
    }

    @Transactional
    public FriendRequestDto withdrawFriendRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getSender().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Not authorized to withdraw this request");
        }

        request.setStatus(FriendRequest.Status.WITHDRAWN);
        request = friendRequestRepository.save(request);
        return FriendRequestDto.fromEntity(request);
    }

    public List<FriendRequestDto> getIncomingRequests(User user) {
        return friendRequestRepository.findByReceiverAndStatus(user, FriendRequest.Status.PENDING)
                .stream()
                .map(FriendRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FriendRequestDto> getOutgoingRequests(User user) {
        return friendRequestRepository.findBySenderAndStatus(user, FriendRequest.Status.PENDING)
                .stream()
                .map(FriendRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FriendDto> getFriends(User currentUser) {
        List<Friendship> friendships = friendshipRepository.findAllForUser(currentUser);
        List<FriendDto> result = new ArrayList<>();

        for (Friendship f : friendships) {
            User friend = f.getUser1().getId().equals(currentUser.getId()) ? f.getUser2() : f.getUser1();

            // Skip if blocked
            if (blockedUserRepository.isBlockedEitherWay(currentUser, friend)) {
                continue;
            }

            FriendDto dto = new FriendDto();
            dto.setFriendshipId(f.getId());
            dto.setFriend(UserDto.fromEntity(friend));
            dto.setSince(f.getCreatedAt());

            // Last message and unread count
            List<ChatMessage> conv = chatMessageRepository.findConversation(currentUser.getId(), friend.getId());
            if (!conv.isEmpty()) {
                ChatMessage last = conv.get(conv.size() - 1);
                dto.setLastMessage(last.getMessageType() == ChatMessage.MessageType.TEXT ? last.getContent() : "[" + last.getMessageType() + "]");
                dto.setLastMessageTime(last.getCreatedAt());
            }

            dto.setUnreadCount(chatMessageRepository.countUnreadFromSender(currentUser.getId(), friend.getId()));
            result.add(dto);
        }

        return result;
    }

    @Transactional
    public void blockUser(User blocker, Long targetUserId) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (blockedUserRepository.findByBlockerAndBlocked(blocker, target).isEmpty()) {
            BlockedUser block = new BlockedUser(blocker, target);
            blockedUserRepository.save(block);
        }

        // Remove any friendship
        friendshipRepository.findBetween(blocker, target).ifPresent(friendshipRepository::delete);
    }

    @Transactional
    public void unblockUser(User blocker, Long targetUserId) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        blockedUserRepository.findByBlockerAndBlocked(blocker, target)
                .ifPresent(blockedUserRepository::delete);
    }

    public List<UserDto> getBlockedUsers(User blocker) {
        return blockedUserRepository.findByBlocker(blocker)
                .stream()
                .map(b -> UserDto.fromEntity(b.getBlocked()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void reportUser(User reporter, ReportRequest req) {
        User reported = userRepository.findById(req.getReportedUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Report report = new Report(reporter, reported, req.getReason(), req.getDetails());
        reportRepository.save(report);
    }
}
