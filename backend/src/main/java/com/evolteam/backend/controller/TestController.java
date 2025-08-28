package com.evolteam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/check")
    public String checkPassword() {
        boolean matches = passwordEncoder.matches(
                "admin123",
                "$2a$10$U7UMnHB3l5VWxghH02rYReMFU.V4.x8bXBmZpBeyeQ3sYIN9Dgyxm"
        );

        return matches ? "✅ Password matches!" : "❌ Password does NOT match!";
    }
}
