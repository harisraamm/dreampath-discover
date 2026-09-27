package com.dreampath.user;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.dreampath.user.AuthDtos.AdminLoginRequest;
import com.dreampath.user.AuthDtos.AuthResponse;
import com.dreampath.user.AuthDtos.MeResponse;
import com.dreampath.user.AuthDtos.OtpRequest;
import com.dreampath.user.AuthDtos.OtpSentResponse;
import com.dreampath.user.AuthDtos.OtpVerifyRequest;
import com.dreampath.user.AuthDtos.OtpVerifyResult;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final OtpAuthService otpAuthService;
    private final JwtTokenService tokens;
    private final String adminEmail;
    private final String adminPasswordHash;
    private final PasswordEncoder passwordEncoder;

    public AuthController(OtpAuthService otpAuthService, JwtTokenService tokens,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.admin.email:}") String adminEmail,
                          @Value("${app.admin.password:}") String adminPassword) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            throw new IllegalStateException("Set ADMIN_EMAIL and ADMIN_PASSWORD in the .env file.");
        }
        this.otpAuthService = otpAuthService;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail.trim().toLowerCase(Locale.ROOT);
        this.adminPasswordHash = passwordEncoder.encode(adminPassword);
    }

    @PostMapping("/otp/request")
    public OtpSentResponse requestOtp(@RequestBody OtpRequest request) {
        OtpAuthService.OtpRequestResult result = otpAuthService.requestCode(request == null ? null : request.contact());
        return new OtpSentResponse("A sign-in code was sent.", result.deliveryMethod(), result.maskedContact());
    }

    @PostMapping("/otp/verify")
    public AuthResponse verifyOtp(@RequestBody OtpVerifyRequest request) {
        OtpVerifyResult result = otpAuthService.verifyCode(
                request == null ? null : request.contact(), request == null ? null : request.code());
        if (result.response() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, result.error());
        }
        return result.response();
    }

    @PostMapping("/admin-login")
    public AuthResponse adminLogin(@RequestBody AdminLoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials.");
        }
        byte[] supplied = request.email().trim().toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8);
        byte[] expected = adminEmail.getBytes(StandardCharsets.UTF_8);
        boolean emailMatches = MessageDigest.isEqual(supplied, expected);
        boolean passwordMatches = passwordEncoder.matches(request.password(), adminPasswordHash);
        if (!emailMatches || !passwordMatches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials.");
        }
        return tokens.issue(adminEmail, "ADMIN");
    }

    @GetMapping("/me")
    public MeResponse me(AbstractAuthenticationToken authentication) {
        String role = "USER";
        if (authentication instanceof JwtAuthenticationToken jwt
                && "ADMIN".equals(jwt.getToken().getClaimAsString("role"))) {
            role = "ADMIN";
        }
        return new MeResponse(role, authentication.getName());
    }
}
