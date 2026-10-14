package com.vibematch.service;

import com.vibematch.dto.ExtraDto.AdminMetricsDto;
import com.vibematch.dto.UserDto;
import com.vibematch.entity.Report;
import com.vibematch.entity.User;
import com.vibematch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final FriendshipRepository friendshipRepository;
    private final CommunityRepository communityRepository;

    public AdminService(UserRepository userRepository,
                        ReportRepository reportRepository,
                        ChatMessageRepository chatMessageRepository,
                        FriendshipRepository friendshipRepository,
                        CommunityRepository communityRepository) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.friendshipRepository = friendshipRepository;
        this.communityRepository = communityRepository;
    }

    public AdminMetricsDto getMetrics() {
        AdminMetricsDto metrics = new AdminMetricsDto();
        metrics.setTotalUsers(userRepository.count());
        metrics.setActiveUsersOnline(userRepository.countByIsOnline(true));
        metrics.setTotalMatchesMade(friendshipRepository.count());
        metrics.setTotalMessagesExchanged(chatMessageRepository.count());
        metrics.setPendingReportsCount(reportRepository.countByStatus(Report.Status.PENDING));
        metrics.setTotalCommunities(communityRepository.count());
        return metrics;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto toggleVerify(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsVerified(!Boolean.TRUE.equals(user.getIsVerified()));
        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto toggleBan(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsBanned(!Boolean.TRUE.equals(user.getIsBanned()));
        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Report resolveReport(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        try {
            report.setStatus(Report.Status.valueOf(status.toUpperCase()));
        } catch (Exception e) {
            report.setStatus(Report.Status.RESOLVED);
        }
        return reportRepository.save(report);
    }
}
