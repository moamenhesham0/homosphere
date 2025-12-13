package com.homosphere.backend.config;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
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
            requestPath.startsWith("/api/public/"))
            // || requestPath.startsWith("/api/user-subscriptions/")) 
            {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Skip JWT authentication for signup endpoints (user doesn't exist yet)
        // TODO: Join with the above condition to reduce multiple filterChain.doFilter calls
        if (requestPath.equals("/api/auth/google-signup") || requestPath.equals("/api/auth/signup")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Skip JWT validation for public GET requests to /api/properties/**
        if ("GET".equals(request.getMethod()) && requestPath.startsWith("/api/properties")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        String userId = null;
        String token;

        /*
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
        } catch (Exception e) {
            logger.warn("Token extraction failed: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

       /*
        * Validate token and set authentication
        * avoid overwriting existing authnication from previous filter
        */
        if(userId != null && SecurityContextHolder.getContext().getAuthentication() == null){

            if (!jwtService.validateToken(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            }

            UUID userUuid;
            try {
                userUuid = UUID.fromString(userId);
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid UUID format for userId: {}", userId);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid user ID format");
                return;
            }

            Optional<User> userOpt = userRepository.findById(userUuid);
            if (userOpt.isEmpty()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            }

            User user = userOpt.get();

           /*
            * Extract role from JWT token metadata
            */
            String role = "USER"; // Default role
            try {
                role = jwtService.extractUserRole(token);
            } catch (Exception e) {
                logger.warn("Role extraction failed, using default: {}", e.getMessage());
            }
            
            // Create authorities with ROLE_ prefix
            java.util.Collection<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = 
                java.util.Collections.singletonList(
                    new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)
                );
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    userId,  // Use userId as principal
                    null, 
                    authorities  // Add authorities for @PreAuthorize checks
                );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

}