package com.homosphere.backend.repository;

import com.homosphere.backend.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, UUID> {
}
