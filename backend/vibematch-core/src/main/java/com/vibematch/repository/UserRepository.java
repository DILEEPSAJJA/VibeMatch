package com.vibematch.repository;

import com.vibematch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id != :currentUserId AND u.isBanned = false AND u.role = 'ROLE_USER'")
    List<User> findPotentialMatches(@Param("currentUserId") Long currentUserId);

    List<User> findByIsBanned(Boolean isBanned);
    long countByIsOnline(Boolean isOnline);
}
