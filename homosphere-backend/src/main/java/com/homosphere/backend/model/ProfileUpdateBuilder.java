package com.homosphere.backend.model;

public class ProfileUpdateBuilder {
        private final Profile profile;
        
        public ProfileUpdateBuilder(Profile profile) {
            this.profile = profile;
        }
        
        public ProfileUpdateBuilder withFirstName(String firstName) {
            if(firstName != null) {
                profile.setFirstName(firstName);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withLastName(String lastName) {
            if(lastName != null) {
                profile.setLastName(lastName);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withBio(String bio) {
            if(bio != null) {
                profile.setBio(bio);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withRole(String role) {
            if(role != null) {
                profile.setRole(role);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withPhone(String phone) {
            if(phone != null) {
                profile.setPhone(phone);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withLocation(String location) {
            if(location != null) {
                profile.setLocation(location);
            }
            return this;
        }
        
        public ProfileUpdateBuilder withPhoto(String photo) {
            if(photo != null) {
                profile.setPhoto(photo);
            }
            return this;
        }
        
        public Profile build() {
            return profile;
        }
}
