package com.urlShortener.controller;

import com.urlShortener.model.UrlMapping;
import com.urlShortener.service.UrlMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class RedirectController {

    @Autowired
    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl, HttpServletRequest request){
        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");
        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl, ip, ua);
        if (urlMapping != null){
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(urlMapping.getOriginalUrl()))
                    .build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
