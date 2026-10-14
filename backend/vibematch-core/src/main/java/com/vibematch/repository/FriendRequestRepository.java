package com.vibematch.repository;

import com.vibematch.entity.FriendRequest;
import com.vibematch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequest.Status status);
    List<FriendRequest> findBySenderAndStatus(User sender, FriendRequest.Status status);

    @Query("SELECT fr FROM FriendRequest fr WHERE " +
           "(fr.sender = :user1 AND fr.receiver = :user2) OR " +
           "(fr.sender = :user2 AND fr.receiver = :user1)")
    List<FriendRequest> findBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    Optional<FriendRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, FriendRequest.Status status);
}
