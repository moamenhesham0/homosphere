package com.homosphere.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.User;


@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String Email);
    List<User> findByRole(String role);
    List<User> findByRoleIgnoreCase(String role);
    Page<User> findByRoleIgnoreCase(String role, Pageable pageable);
    Page<User> findByEmailIgnoreCaseOrFirstNameIgnoreCaseOrLastNameIgnoreCase(String email, String firstName, String lastName, Pageable pageable);
    // Custom query to match email or full name (first + last)
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:query) OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) = LOWER(:query)")
    Page<User> findByEmailIgnoreCaseOrFullName(String query, Pageable pageable);
}