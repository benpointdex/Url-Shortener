package com.urlShortner.controller;

import com.urlShortner.dtos.UrlMappingDTO;
import com.urlShortner.model.User;
import com.urlShortner.service.UrlMappingService;
import com.urlShortner.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("api/urls")
public class UrlMappingController {
    @Autowired
    private UserService userService;
    @Autowired
    private UrlMappingService urlMappingService;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> creatShortUrl(@RequestBody Map<String, String> request  , Principal principal){
    String originalUrl= request.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
    UrlMappingDTO urlMappingDTO= urlMappingService.createShortUrl(originalUrl , user);
    return ResponseEntity.ok(urlMappingDTO);
    }
}
