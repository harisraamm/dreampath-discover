package com.dreampath.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, Long> {
    Optional<OtpChallenge> findFirstByContactAndConsumedFalseOrderByCreatedAtDesc(String contact);
    Optional<OtpChallenge> findFirstByContactOrderByCreatedAtDesc(String contact);
    void deleteByContact(String contact);
}
