package com.urlShortener.controller;

import com.urlShortener.dtos.LoginRequest;
import com.urlShortener.dtos.RegisterRequest;
import com.urlShortener.model.User;
import com.urlShortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;



    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){

    User user= new User();
    user.setUsername(registerRequest.getUsername());
    user.setPassword(registerRequest.getPassword());
    user.setEmail(registerRequest.getEmail());
    user.setRoles("ROLE_USER");
    userService.registerUser(user);
    return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest
                                       loginRequest){
        User user= new User();
        user.setUsername(loginRequest.getUsername());
        user.setPassword(loginRequest.getPassword());
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }
}
