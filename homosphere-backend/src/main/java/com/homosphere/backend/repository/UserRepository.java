package com.homosphere.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.model.User;


public interface UserRepository extends JpaRepository<User, Long>{

    User findUserByEmail(String email);
} 
