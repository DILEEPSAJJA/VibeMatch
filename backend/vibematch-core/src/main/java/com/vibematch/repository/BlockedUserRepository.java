package com.vibematch.repository;

import com.vibematch.entity.BlockedUser;
import com.vibematch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {
    List<BlockedUser> findByBlocker(User blocker);
    Optional<BlockedUser> findByBlockerAndBlocked(User blocker, User blocked);

    @Query("SELECT COUNT(b) > 0 FROM BlockedUser b WHERE " +
           "(b.blocker = :user1 AND b.blocked = :user2) OR " +
           "(b.blocker = :user2 AND b.blocked = :user1)")
    boolean isBlockedEitherWay(@Param("user1") User user1, @Param("user2") User user2);
}
