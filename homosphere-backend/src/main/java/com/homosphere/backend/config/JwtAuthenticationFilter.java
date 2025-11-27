package com.homosphere.backend.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserPrincipal;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

import java.util.Optional;
@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final UserRepository userRepository;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Skip JWT validation for public endpoints only
        String requestPath = request.getRequestURI();
        if (requestPath.startsWith("/api/auth/") || 
            requestPath.startsWith("/api/public/") || 
            requestPath.startsWith("/api/subscription-tiers/") ||
            requestPath.startsWith("/api/user-subscriptions/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        /**
         * Authorization: Bearer <JWT_TOKEN_HERE>
        */                   
        String authHeader = request.getHeader("Authorization");
        String userId = null;
        String userEmail = null;
        String userRole = null;
        String token;                                

        /**
         * Extract JWT token from Authorization header
         */
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            // Allow requests without auth header to pass through (for public endpoints)
            filterChain.doFilter(request, response);
            return;
        }

        token = authHeader.replaceFirst("Bearer ", "");
        try {
            userId = jwtService.extractUserId(token);
            
            // Try to extract email and role, but don't fail if they're missing
            try {
                userEmail = jwtService.extractUserEmail(token);
                userRole = jwtService.extractUserRole(token);
            } catch (Exception e) {
                logger.debug("User metadata not found in token (this is okay for some operations): {}", e.getMessage());
                // For endpoints that only need user ID (like profile deletion), we can continue
            }
        } catch (Exception e) {
            logger.warn("Token extraction failed: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

       /**
        * Validate token and set authentication
        * avoid overwriting existing authnication from previous filter
        */
        if(userId != null && SecurityContextHolder.getContext().getAuthentication() == null){

            if (!jwtService.validateToken(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            }

            // For profile deletion endpoint, we don't need to load user from database
            // Just create a simple authentication with the user ID
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    userId,  // Use userId as principal
                    null, 
                    null  // No authorities needed for delete
                );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);                                
    }

}