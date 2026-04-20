package com.urlShortener.controller;

import com.urlShortener.dtos.ClickEventDTO;
import com.urlShortener.dtos.UrlMappingDTO;
import com.urlShortener.model.ClickEvent;
import com.urlShortener.model.UrlMapping;
import com.urlShortener.model.User;
import com.urlShortener.repository.ClickEventRepository;
import com.urlShortener.repository.UrlMappingRepository;
import com.urlShortener.service.UrlMappingService;
import com.urlShortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/urls")
public class UrlMappingController {
    @Autowired
    private UserService userService;
    @Autowired
    private UrlMappingService urlMappingService;
    @Autowired
    private UrlMappingRepository urlMappingRepository;
    @Autowired
    private ClickEventRepository clickEventRepository;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> creatShortUrl(@RequestBody Map<String, String> request  , Principal principal){
        String originalUrl= request.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO= urlMappingService.createShortUrl(originalUrl , user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal){
        User user= userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls= urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        urlMappingRepository.findById(id).ifPresent(url -> {
            if (url.getUser().getId().equals(user.getId())) {
                urlMappingRepository.delete(url);
            }
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getUrlAnalytics(
            @PathVariable String shortUrl, 
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping == null) return ResponseEntity.notFound().build();

        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingAndClickDateBetween(
            urlMapping, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
            
        Map<LocalDate, Long> stats = clickEvents.stream()
            .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
            
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(
            Principal principal,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        User user = userService.findByUsername(principal.getName());
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusWeeks(1);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClicksByUserAndDate(user, start, end);
        return ResponseEntity.ok(totalClicks);
    }

    @GetMapping("/recentClicks/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getRecentClicks(@PathVariable String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping == null) return ResponseEntity.notFound().build();

        List<ClickEvent> recent = clickEventRepository.findByUrlMappingAndClickDateBetween(
            urlMapping, LocalDateTime.now().minusDays(30), LocalDateTime.now());
            
        List<ClickEventDTO> dtos = recent.stream().sorted((a,b) -> b.getClickDate().compareTo(a.getClickDate())).limit(10).map(click -> {
            ClickEventDTO dto = new ClickEventDTO();
            dto.setClickDate(click.getClickDate());
            dto.setIpAddress(click.getIpAddress());
            dto.setUserAgent(click.getUserAgent());
            
            // Simple UA parsing
            String ua = click.getUserAgent().toLowerCase();
            if (ua.contains("mobile") || ua.contains("iphone") || ua.contains("android")) dto.setDevice("Mobile");
            else dto.setDevice("Desktop");
            
            if (ua.contains("chrome")) dto.setBrowser("Chrome");
            else if (ua.contains("firefox")) dto.setBrowser("Firefox");
            else if (ua.contains("safari")) dto.setBrowser("Safari");
            else if (ua.contains("edge")) dto.setBrowser("Edge");
            else dto.setBrowser("Other");
            
            dto.setOs(ua.contains("windows") ? "Windows" : ua.contains("mac") ? "MacOS" : ua.contains("linux") ? "Linux" : "Other");
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
