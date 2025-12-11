// package com.homosphere.backend.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.homosphere.backend.dto.PrivateUserDto;
// import com.homosphere.backend.dto.PublicUserDto;
// import com.homosphere.backend.model.RegisterUser;
// import com.homosphere.backend.model.User;
// import com.homosphere.backend.repository.UserRepository;
// import com.homosphere.backend.repository.UserSubscriptionRepository;
// import com.homosphere.backend.service.SupabaseAdminService;
// import com.homosphere.backend.service.UserService;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.context.annotation.ComponentScan;
// import org.springframework.context.annotation.FilterType;
// import org.springframework.http.MediaType;
// import org.springframework.security.core.Authentication;
// import org.springframework.test.web.servlet.MockMvc;

// import org.springframework.security.core.context.SecurityContextHolder;
// import org.junit.jupiter.api.AfterEach;

// import java.util.UUID;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.Mockito.*;
// import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(
//     controllers = UserController.class,
//     excludeFilters = {
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.JwtAuthenticationFilter.class),
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.SecurityConfig.class),
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CorsConfig.class),
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.ApplicationConfig.class),
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareR2Config.class),
//         @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareProperties.class)
//     }
// )
// @AutoConfigureMockMvc(addFilters = false)
// class UserControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @MockBean
//     private UserService userService;

//     @MockBean
//     private UserRepository userRepository;

//     @MockBean
//     private UserSubscriptionRepository userSubscriptionRepository;

//     @MockBean
//     private SupabaseAdminService supabaseAdminService;

//     private User user;
//     private UUID userId;
//     private Authentication authentication;

//     @BeforeEach
//     void setUp() {
//         userId = UUID.randomUUID();
//         user = new User();
//         user.setId(userId);
//         user.setEmail("test@example.com");
//         user.setFirstName("Test");
//         user.setLastName("User");
//         user.setRole("BUYER");

//         authentication = mock(Authentication.class);
//         when(authentication.isAuthenticated()).thenReturn(true);
//         when(authentication.getPrincipal()).thenReturn(userId.toString());
//         SecurityContextHolder.getContext().setAuthentication(authentication);
//     }

//     @AfterEach
//     void tearDown() {
//         SecurityContextHolder.clearContext();
//     }

//     @Test
//     void saveNewUser_ValidUser_ReturnsOk() throws Exception {
//         RegisterUser registerUser = new RegisterUser("New", "User", "password", "new@example.com", null, "BUYER");

//         mockMvc.perform(post("/api/public/user")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(registerUser)))
//                 .andExpect(status().isOk());

//         verify(userService).saveUser(any(RegisterUser.class));
//     }

//     @Test
//     void editUser_Authenticated_ReturnsUpdatedUser() throws Exception {
//         when(userService.editInformation(eq(userId), any(User.class))).thenReturn(user);

//         mockMvc.perform(put("/api/user")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(user)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.email").value(user.getEmail()));
//     }

//     @Test
//     void retrieveInformation_Authenticated_ReturnsPrivateDto() throws Exception {
//         when(userService.getInformation(userId)).thenReturn(user);

//         mockMvc.perform(get("/api/user"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.email").value(user.getEmail()));
//     }

//     @Test
//     void retrievePublicInformation_ValidId_ReturnsPublicDto() throws Exception {
//         when(userService.getInformation(userId)).thenReturn(user);

//         mockMvc.perform(get("/api/public/retrieveInf/{id}", userId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.firstName").value(user.getFirstName()));
//     }

//     @Test
//     void deleteUser_Authenticated_ReturnsOk() throws Exception {
//         when(userRepository.existsById(userId)).thenReturn(true);

//         mockMvc.perform(delete("/api/user"))
//                 .andExpect(status().isOk());

//         verify(userSubscriptionRepository).deleteByUser_Id(userId);
//         verify(userRepository).deleteById(userId);
//         verify(supabaseAdminService).deleteUser(userId.toString());
//     }
// }
