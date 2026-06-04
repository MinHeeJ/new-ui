package com.cms.controller;

import com.cms.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/api/health")
    public Result<String> health() {
        return Result.ok("CMS is running");
    }
}
