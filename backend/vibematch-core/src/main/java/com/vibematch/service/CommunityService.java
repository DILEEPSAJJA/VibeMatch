package com.vibematch.service;

import com.vibematch.dto.ExtraDto.*;
import com.vibematch.entity.Community;
import com.vibematch.entity.CommunityPost;
import com.vibematch.entity.User;
import com.vibematch.repository.CommunityPostRepository;
import com.vibematch.repository.CommunityRepository;
import com.vibematch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityPostRepository postRepository;
    private final UserRepository userRepository;

    public CommunityService(CommunityRepository communityRepository,
                            CommunityPostRepository postRepository,
                            UserRepository userRepository) {
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<CommunityDto> getAllCommunities(Long currentUserId) {
        return communityRepository.findAll()
                .stream()
                .map(c -> CommunityDto.fromEntity(c, currentUserId))
                .collect(Collectors.toList());
    }

    public CommunityDto getCommunity(Long id, Long currentUserId) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));
        return CommunityDto.fromEntity(community, currentUserId);
    }

    @Transactional
    public CommunityDto joinCommunity(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));
        community.addMember(userId);
        community = communityRepository.save(community);
        return CommunityDto.fromEntity(community, userId);
    }

    @Transactional
    public CommunityDto leaveCommunity(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));
        community.removeMember(userId);
        community = communityRepository.save(community);
        return CommunityDto.fromEntity(community, userId);
    }

    public List<CommunityPostDto> getPosts(Long communityId) {
        return postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId)
                .stream()
                .map(CommunityPostDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityPostDto createPost(Long communityId, User author, String content) {
        CommunityPost post = new CommunityPost(
                communityId,
                author.getId(),
                author.getFullName() != null ? author.getFullName() : author.getUsername(),
                author.getAvatarUrl(),
                content
        );
        post = postRepository.save(post);
        return CommunityPostDto.fromEntity(post);
    }
}
