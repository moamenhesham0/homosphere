package com.homosphere.backend.model;

public class UserUpdateBuilder {
        private final User user;
        
        public UserUpdateBuilder(User user) {
            this.user = user;
        }
        
        public UserUpdateBuilder withFirstName(String firstName) {
            if(firstName != null) {
                user.setFirstName(firstName);
            }
            return this;
        }
        
        public UserUpdateBuilder withLastName(String lastName) {
            if(lastName != null) {
                user.setLastName(lastName);
            }
            return this;
        }
        
        public UserUpdateBuilder withBio(String bio) {
            if(bio != null) {
                user.setBio(bio);
            }
            return this;
        }
        
        public UserUpdateBuilder withRole(String role) {
            if(role != null) {
                user.setRole(role);
            }
            return this;
        }
        
        public UserUpdateBuilder withPhone(String phone) {
            if(phone != null) {
                user.setPhone(phone);
            }
            return this;
        }
        
        public UserUpdateBuilder withLocation(String location) {
            if(location != null) {
                user.setLocation(location);
            }
            return this;
        }
        
        public UserUpdateBuilder withPhoto(String photo) {
            if(photo != null) {
                user.setPhoto(photo);
            }
            return this;
        }
        
        public UserUpdateBuilder withUserName(String userName) {
            if(userName != null) {
                String normalizedUserName = userName.trim();
                user.setUserName(normalizedUserName.isEmpty() ? null : normalizedUserName);
            }
            return this;
        }
        
        public User build() {
            return user;
        }
}
