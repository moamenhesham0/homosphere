package com.homosphere.backend.updater;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.repository.PropertyImageRepository;

class PropertyImageUpdaterTest {
    @Mock PropertyImageRepository propertyImageRepository;
    @InjectMocks PropertyImageUpdater propertyImageUpdater;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void update_UpdatesImageAndSaves() {
        PropertyImage image = new PropertyImage();
        PropertyImageRequest req = new PropertyImageRequest();
        req.setImageUrl("url");
        when(propertyImageRepository.save(any())).thenReturn(image);
        propertyImageUpdater.update(image, req);
        assertEquals("url", image.getImageUrl());
    }

    @Test
    void remove_DeletesImage() {
        PropertyImage image = new PropertyImage();
        doNothing().when(propertyImageRepository).delete(any());
        propertyImageUpdater.remove(image);
        verify(propertyImageRepository).delete(image);
    }
}
