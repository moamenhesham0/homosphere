// package com.homosphere.backend.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.homosphere.backend.dto.UpdateSubscriptionTierDTO;
// import com.homosphere.backend.model.SubscriptionTier;
// import com.homosphere.backend.model.User;
// import com.homosphere.backend.model.UserSubscription;
// import com.homosphere.backend.repository.UserSubscriptionRepository;
// import com.homosphere.backend.service.UserSubscriptionService;
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

// import java.time.LocalDate;
// import java.util.Collections;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.Mockito.*;
// import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(
//     controllers = UserSubscriptionController.class,
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
// class UserSubscriptionControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @MockBean
//     private UserSubscriptionRepository userSubscriptionRepository;

//     @MockBean
//     private UserSubscriptionService userSubscriptionService;

//     private UserSubscription userSubscription;
//     private UUID userId;
//     private Authentication authentication;

//     @BeforeEach
//     void setUp() {
//         userId = UUID.randomUUID();
//         User user = new User();
//         user.setId(userId);
//         user.setRole("BUYER");

//         SubscriptionTier tier = new SubscriptionTier();
//         tier.setSubscriptionId(1L);
//         tier.setName("Basic");

//         userSubscription = new UserSubscription();
//         userSubscription.setUserSubscriptionId(1L);
//         userSubscription.setUser(user);
//         userSubscription.setSubscription(tier);
//         userSubscription.setStartDate(LocalDate.now());
//         userSubscription.setStatus(UserSubscription.Status.ACTIVE);

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
//     void getAllUserSubscriptions_ReturnsList() throws Exception {
//         when(userSubscriptionRepository.findAll()).thenReturn(Collections.singletonList(userSubscription));

//         mockMvc.perform(get("/api/user-subscriptions"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$[0].userSubscriptionId").value(1L));
//     }

//     @Test
//     void getUserSubscriptionById_ValidId_ReturnsSubscription() throws Exception {
//         when(userSubscriptionRepository.findById(1L)).thenReturn(Optional.of(userSubscription));

//         mockMvc.perform(get("/api/user-subscriptions/1"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.userSubscriptionId").value(1L));
//     }

//     @Test
//     void getMySubscriptions_Authenticated_ReturnsList() throws Exception {
//         when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.singletonList(userSubscription));

//         mockMvc.perform(get("/api/user-subscriptions/my-subscriptions"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$[0].userSubscriptionId").value(1L));
//     }

//     @Test
//     void createUserSubscription_ValidData_ReturnsCreated() throws Exception {
//         when(userSubscriptionRepository.save(any(UserSubscription.class))).thenReturn(userSubscription);

//         mockMvc.perform(post("/api/user-subscriptions")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(userSubscription)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.userSubscriptionId").value(1L));
//     }

//     @Test
//     void updateMySubscriptionTier_ValidData_ReturnsUpdated() throws Exception {
//         UpdateSubscriptionTierDTO updateDTO = new UpdateSubscriptionTierDTO();
//         updateDTO.setNewSubscriptionTierId(2L);
//         updateDTO.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
//         updateDTO.setStartDate(LocalDate.now());
//         updateDTO.setEndDate(LocalDate.now().plusMonths(1));

//         when(userSubscriptionService.updateTier(eq(userId), any(UpdateSubscriptionTierDTO.class))).thenReturn(userSubscription);

//         mockMvc.perform(put("/api/user-subscriptions/update-my-tier")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(updateDTO)))
//                 .andExpect(status().isOk());
//     }

//     @Test
//     void deleteUserSubscription_ExistingId_ReturnsOk() throws Exception {
//         when(userSubscriptionRepository.existsById(1L)).thenReturn(true);

//         mockMvc.perform(delete("/api/user-subscriptions/1"))
//                 .andExpect(status().isOk());

//         verify(userSubscriptionRepository).deleteById(1L);
//     }
// }
