package com.vibematch.repository;

import com.vibematch.entity.Friendship;
import com.vibematch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE f.user1 = :user OR f.user2 = :user")
    List<Friendship> findAllForUser(@Param("user") User user);

    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.user1 = :user1 AND f.user2 = :user2) OR " +
           "(f.user1 = :user2 AND f.user2 = :user1)")
    Optional<Friendship> findBetween(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE " +
           "(f.user1 = :user1 AND f.user2 = :user2) OR " +
           "(f.user1 = :user2 AND f.user2 = :user1)")
    boolean areFriends(@Param("user1") User user1, @Param("user2") User user2);
}
