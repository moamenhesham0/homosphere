package com.homosphere.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.NoArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@NoArgsConstructor
public class JwtService {

    @Value("${supabase.jwt.secret}")
    private String secretKey;
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    public String extractUserId(String token){
        String userId = extractClaim(token, Claims::getSubject);
        if (userId == null) {
            throw new IllegalArgumentException("User missing in token");
        }
        return userId;
    }


    public String extractUserEmail(String token){
        return extractClaim(token, claims -> {
            HashMap<?, ?> metaData = claims.get("user_metadata", HashMap.class);
            if (metaData != null) {
                return metaData.get("Email").toString();
            }
            throw new IllegalArgumentException("Email missing in token");
        }
        );
    }

    public String extractUserRole(String token){
        return extractClaim(token, claims -> {
            HashMap<?, ?> metaData = claims.get("user_metadata", HashMap.class);
            if (metaData != null) {
                return metaData.get("Role").toString();
            }
            throw new IllegalArgumentException("Role missing in token");
        }
        );
    }

    public Date extractExpirationDate(String token){
        Date expirationDate = extractClaim(token, Claims::getExpiration);
        if (expirationDate == null) {
            throw new IllegalArgumentException("Expiration Date missing in token");
        }
        return expirationDate;
    }

    public Boolean validateToken(String token) {
        try {
            return !extractExpirationDate(token).before(new Date());
        } catch (Exception e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
    * Allows extracting any type of claim from the token's payload.
    * Provide a lambda function (claimsResolver)
    */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
 
    private Claims extractAllClaims(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignKey())  //vertify the signature
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }

    /* 
    * convert the secret token into key 
    */
    private Key getSignKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
}
