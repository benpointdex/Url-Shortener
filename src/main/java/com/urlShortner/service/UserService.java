package com.urlShortner.service;

import com.urlShortner.dtos.LoginRequest;
import com.urlShortner.model.User;
import com.urlShortner.repository.UserRepository;
import com.urlShortner.security.JwtAuthenticationResponse;
import com.urlShortner.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;
    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);

    }

    public JwtAuthenticationResponse loginUser(LoginRequest loginRequest){
        Authentication authentication=  authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails= (UserDetailsImpl) ((Authentication) authentication).getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

return new JwtAuthenticationResponse(jwt);
    }
}
