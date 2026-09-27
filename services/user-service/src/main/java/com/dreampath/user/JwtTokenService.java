package com.dreampath.user;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import com.dreampath.user.AuthDtos.AuthResponse;

@Service
public class JwtTokenService {
    private final JwtEncoder encoder;
    private final long tokenMinutes;

    public JwtTokenService(JwtEncoder encoder,
                           @Value("${app.security.token-minutes:720}") long tokenMinutes) {
        this.encoder = encoder;
        this.tokenMinutes = tokenMinutes;
    }

    public AuthResponse issue(String contact, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(tokenMinutes, ChronoUnit.MINUTES);
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("dreampath-discover")
                .subject(contact)
                .issuedAt(now)
                .expiresAt(expiresAt)
                .claim("roles", List.of("ROLE_" + role))
                .claim("role", role)
                .build();
        String value = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new AuthResponse(value, "Bearer", role, contact, expiresAt);
    }
}
