package com.homosphere.backend.controller;


import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.model.Profile;
import com.homosphere.backend.model.registerUser;
import com.homosphere.backend.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {

   @Autowired
   private final ProfileService profileService;

    @PostMapping("/api/public/user")
    public void saveNewuser(@RequestBody registerUser registerUser){
        
        profileService.saveprofile(registerUser);
    }

    @PutMapping("/api/public/editProfile/{id}")
    public Profile editProfile (@PathVariable UUID id,@RequestBody Profile Profile){
        return profileService.editInformation(id, Profile);
    }
    
    @GetMapping("api/public/retrieveInf/{id}")
    public  Profile retrieveInformation(@PathVariable UUID id){
        return profileService.GetInformation(id);
    }

    @GetMapping("api/public/signup/{id}")
    public String signup (@PathVariable UUID id){
        return profileService.signuPprofile(id);
    }
    
}
