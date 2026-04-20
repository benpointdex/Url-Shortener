package com.urlShortener.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClickEventDTO {
    private LocalDateTime clickDate;
    private String ipAddress;
    private String userAgent;
    private String device;
    private String browser;
    private String os;
    private String location;
    private Long count; 
}
