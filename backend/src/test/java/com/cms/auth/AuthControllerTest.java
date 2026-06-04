package com.cms.auth;

import com.cms.common.GlobalExceptionHandler;
import com.cms.support.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({GlobalExceptionHandler.class, TestSecurityConfig.class})
class AuthControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    CmsUserMapper cmsUserMapper;

    @MockBean
    PasswordEncoder passwordEncoder;

    @MockBean
    JwtTokenProvider jwtTokenProvider;

    @Test
    void login_returnsJwt_whenUsernameAndPasswordAreValid() throws Exception {
        CmsUser user = new CmsUser();
        user.setUsername("admin");
        user.setPassword("encoded-password");
        user.setRole("ADMIN");

        when(cmsUserMapper.selectByUsername("admin")).thenReturn(user);
        when(passwordEncoder.matches("cms1234", "encoded-password")).thenReturn(true);
        when(jwtTokenProvider.generateToken("admin", "ADMIN")).thenReturn("jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"cms1234\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.token").value("jwt-token"))
                .andExpect(jsonPath("$.data.username").value("admin"))
                .andExpect(jsonPath("$.data.role").value("ADMIN"));
    }

    @Test
    void login_returnsUnauthorized_whenPasswordIsInvalid() throws Exception {
        CmsUser user = new CmsUser();
        user.setUsername("admin");
        user.setPassword("encoded-password");

        when(cmsUserMapper.selectByUsername("admin")).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    void login_returnsBadRequest_whenUsernameIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"cms1234\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void logout_instructsClientToRemoveToken_forStatelessJwt() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.message").value("Remove token on client"));
    }
}
