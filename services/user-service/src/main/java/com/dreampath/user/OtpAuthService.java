package com.dreampath.user;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.dreampath.user.AuthDtos.AuthResponse;
import com.dreampath.user.AuthDtos.OtpVerifyResult;

@Service
public class OtpAuthService {
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int MAX_ATTEMPTS = 5;

    private final OtpChallengeRepository challenges;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final OtpDeliveryService delivery;
    private final JwtTokenService tokens;
    private final int expiresMinutes;
    private final int resendSeconds;

    public OtpAuthService(OtpChallengeRepository challenges, UserRepository users,
                          PasswordEncoder passwordEncoder, OtpDeliveryService delivery,
                          JwtTokenService tokens,
                          @Value("${app.otp.expires-minutes:5}") int expiresMinutes,
                          @Value("${app.otp.resend-seconds:60}") int resendSeconds) {
        this.challenges = challenges;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.delivery = delivery;
        this.tokens = tokens;
        this.expiresMinutes = expiresMinutes;
        this.resendSeconds = resendSeconds;
    }

    @Transactional
    public OtpRequestResult requestCode(String rawContact) {
        Contact contact = normalize(rawContact);
        Instant now = Instant.now();
        Optional<OtpChallenge> mostRecent = challenges.findFirstByContactOrderByCreatedAtDesc(contact.value());
        if (mostRecent.isPresent()
                && Duration.between(mostRecent.get().getCreatedAt(), now).getSeconds() < resendSeconds) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait before requesting another code.");
        }

        challenges.deleteByContact(contact.value());
        String code = String.format(Locale.ROOT, "%06d", RANDOM.nextInt(1_000_000));
        OtpChallenge challenge = new OtpChallenge();
        challenge.setContact(contact.value());
        challenge.setCodeHash(passwordEncoder.encode(code));
        challenge.setCreatedAt(now);
        challenge.setExpiresAt(now.plusSeconds(expiresMinutes * 60L));
        challenge.setAttempts(0);
        challenge.setConsumed(false);
        challenges.save(challenge);

        String channel;
        try {
            channel = delivery.send(contact.value(), code, contact.email());
        } catch (OtpDeliveryService.OtpDeliveryException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "OTP delivery is not configured or the message could not be sent.");
        }
        return new OtpRequestResult(channel, mask(contact.value(), contact.email()));
    }

    @Transactional
    public OtpVerifyResult verifyCode(String rawContact, String rawCode) {
        Contact contact;
        try {
            contact = normalize(rawContact);
        } catch (ResponseStatusException exception) {
            return new OtpVerifyResult(null, "The code is invalid or has expired.");
        }
        String code = rawCode == null ? "" : rawCode.trim();
        if (!code.matches("[0-9]{6}")) {
            return new OtpVerifyResult(null, "The code is invalid or has expired.");
        }

        Optional<OtpChallenge> current = challenges
                .findFirstByContactAndConsumedFalseOrderByCreatedAtDesc(contact.value());
        if (current.isEmpty()) {
            return new OtpVerifyResult(null, "The code is invalid or has expired.");
        }
        OtpChallenge challenge = current.get();
        if (challenge.getExpiresAt().isBefore(Instant.now()) || challenge.getAttempts() >= MAX_ATTEMPTS) {
            challenge.setConsumed(true);
            challenges.save(challenge);
            return new OtpVerifyResult(null, "The code is invalid or has expired.");
        }
        if (!passwordEncoder.matches(code, challenge.getCodeHash())) {
            challenge.setAttempts(challenge.getAttempts() + 1);
            if (challenge.getAttempts() >= MAX_ATTEMPTS) {
                challenge.setConsumed(true);
            }
            challenges.save(challenge);
            return new OtpVerifyResult(null, "The code is invalid or has expired.");
        }

        challenge.setConsumed(true);
        challenges.save(challenge);
        User user = findOrCreateUser(contact);
        return new OtpVerifyResult(tokens.issue(contact.value(), "USER"), null);
    }

    private User findOrCreateUser(Contact contact) {
        Optional<User> existing = contact.email()
                ? users.findByEmail(contact.value())
                : users.findByPhone(contact.value());
        if (existing.isPresent()) {
            return existing.get();
        }
        String name = contact.email() ? contact.value().substring(0, contact.value().indexOf('@')) : "Traveller";
        User user = new User(name, contact.email() ? contact.value() : null,
                contact.email() ? null : contact.value());
        return users.save(user);
    }

    private static Contact normalize(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Enter an email address or phone number.");
        }
        String value = raw.trim().toLowerCase(Locale.ROOT);
        if (!EMAIL.matcher(value).matches() || value.length() > 254) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        return new Contact(value, true);
    }

    private static String mask(String value, boolean email) {
        if (email) {
            int at = value.indexOf('@');
            String name = value.substring(0, at);
            return (name.length() < 2 ? "*" : name.substring(0, 1) + "***") + value.substring(at);
        }
        return value.substring(0, Math.min(3, value.length()))
                + "••••" + value.substring(value.length() - 2);
    }

    private record Contact(String value, boolean email) {}
    public record OtpRequestResult(String deliveryMethod, String maskedContact) {}
}
