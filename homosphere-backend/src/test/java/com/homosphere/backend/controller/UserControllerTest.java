package com.homosphere.backend.controller;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homosphere.backend.model.RegisterUser;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.SupabaseAdminService;
import com.homosphere.backend.service.UserService;
@WebMvcTest(
	controllers = UserController.class,
	excludeFilters = {
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.JwtAuthenticationFilter.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.SecurityConfig.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CorsConfig.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.ApplicationConfig.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareR2Config.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareProperties.class)
	}
)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {
	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;
	@SuppressWarnings("removal")
	@MockBean
	private UserService userService;
	@SuppressWarnings("removal")
	@MockBean
	private UserRepository userRepository;
	@SuppressWarnings("removal")
	@MockBean
	private UserSubscriptionRepository userSubscriptionRepository;
	@SuppressWarnings("removal")
	@MockBean
	private SupabaseAdminService supabaseAdminService;
	private User user;
	private UUID userId;
	private Authentication authentication;

	// Custom Authentication with UUID principal
	static class UuidAuthentication implements Authentication {
		private final UUID uuid;
		UuidAuthentication(UUID uuid) { this.uuid = uuid; }
		@Override public String getName() { return uuid.toString(); }
		@Override public Object getPrincipal() { return uuid.toString(); }
		@Override public Object getCredentials() { return null; }
		@Override public Object getDetails() { return null; }
		@Override public java.util.Collection<org.springframework.security.core.GrantedAuthority> getAuthorities() { return java.util.Collections.emptyList(); }
		@Override public boolean isAuthenticated() { return true; }
		@Override public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {}
	}
    
	@BeforeEach
	void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole("BUYER");
        authentication = new UuidAuthentication(userId);
        SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	@AfterEach
	void tearDown() {
	    SecurityContextHolder.clearContext();
	}

	@Test
	void saveNewUser_ValidUser_ReturnsOk() throws Exception {
        RegisterUser registerUser = new RegisterUser("New", "User", "password", "new@example.com", null, "BUYER");
        mockMvc.perform(post("/api/public/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerUser)))
                    .andExpect(status().isOk());
        verify(userService).saveUser(any(RegisterUser.class));
	}
	@Test
	void editUser_Authenticated_ReturnsUpdatedUser() throws Exception {
        when(userService.editInformation(eq(userId), any(User.class))).thenReturn(user);
        mockMvc.perform(put("/api/user")
            .with(request -> { request.setUserPrincipal(authentication); return request; })
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(user)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(user.getEmail()));
	}

	@Test
	void retrieveInformation_Authenticated_ReturnsPrivateDto() throws Exception {
        when(userService.getInformation(userId)).thenReturn(user);
        mockMvc.perform(get("/api/user")
            .with(request -> { request.setUserPrincipal(authentication); return request; }))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(user.getEmail()));
	}

	@Test
	void retrievePublicInformation_ValidId_ReturnsPublicDto() throws Exception {
        when(userService.getInformation(userId)).thenReturn(user);
        mockMvc.perform(get("/api/public/retrieveInf/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value(user.getFirstName()));
	}

	@Test
	void deleteUser_Authenticated_ReturnsOk() throws Exception {
        when(userRepository.existsById(userId)).thenReturn(true);
        mockMvc.perform(delete("/api/user")
            .with(request -> { request.setUserPrincipal(authentication); return request; }))
            .andExpect(status().isOk());
        verify(userSubscriptionRepository).deleteByUser_Id(userId);
        verify(userRepository).deleteById(userId);
        verify(supabaseAdminService).deleteUser(userId.toString());
	}
}
