package com.cms.auth;

import com.cms.common.BusinessException;
import com.cms.common.Result;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CmsUserMapper cmsUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(CmsUserMapper cmsUserMapper, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.cmsUserMapper = cmsUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        CmsUser user = cmsUserMapper.selectByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(401, "Invalid username or password");
        }
        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());
        return Result.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/logout")
    public Result<Map<String, String>> logout() {
        return Result.ok(Map.of("message", "Remove token on client"));
    }
}
