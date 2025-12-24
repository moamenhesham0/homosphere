package com.homosphere.backend.controller;

import com.homosphere.backend.model.User;
import com.homosphere.backend.service.UsersListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/users-listing")
@RequiredArgsConstructor
public class UsersListingController {
    private final UsersListingService usersListingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(@PageableDefault(size = 10) Pageable pageable) {
        Page<User> users = usersListingService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getUsersByRole(@RequestParam String role, @PageableDefault(size = 10) Pageable pageable) {
        Page<User> users = usersListingService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> searchUsers(@RequestParam String query, @PageableDefault(size = 10) Pageable pageable) {
        Page<User> users = usersListingService.searchUsers(query, pageable);
        return ResponseEntity.ok(users);
    }
}
