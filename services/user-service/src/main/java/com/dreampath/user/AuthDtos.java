package com.dreampath.user;

import java.time.Instant;

public final class AuthDtos {
    private AuthDtos() {}

    public record OtpRequest(String contact) {}
    public record OtpVerifyRequest(String contact, String code) {}
    public record AdminLoginRequest(String email, String password) {}
    public record OtpSentResponse(String message, String deliveryMethod, String maskedContact) {}
    public record AuthResponse(String accessToken, String tokenType, String role,
                               String contact, Instant expiresAt) {}
    public record MeResponse(String role, String contact) {}
    public record OtpVerifyResult(AuthResponse response, String error) {}
}
