package com.quickkart.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Ideally, this should be in application.yml
    private static final String SECRET = "thisIsAVeryLongSecretKeyThatNeedsToBeAtLeast256BitsLongForHS256";
    private static final long EXPIRATION_TIME = 864_000_000; // 10 days
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email, Long userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    
    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }
}
