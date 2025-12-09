package com.homosphere.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "cloudflare.r2")
public class CloudflareProperties {
    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String bucket;
}
