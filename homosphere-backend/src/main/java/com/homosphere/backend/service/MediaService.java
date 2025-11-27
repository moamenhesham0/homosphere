package com.homosphere.backend.service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;


import com.homosphere.backend.exception.FileUploadException;
import com.homosphere.backend.exception.UnsupportedMediaTypeException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    @Value("${cloudflare.r2.account-id}")
    private String accountId;

    @Value("${cloudflare.r2.endpoint:https://%s.r2.cloudflarestorage.com}")
    private String endpoint;

    @Autowired
    private RestTemplate restTemplate;

    public String uploadFile(MultipartFile file){

        String original = Optional.ofNullable(file.getOriginalFilename())
            .orElseThrow(() -> new UnsupportedMediaTypeException("Filename is missing"))
            .toLowerCase();

        String contentType = Optional.ofNullable(file.getContentType())
            .orElseThrow(() -> new UnsupportedMediaTypeException("Content-Type is unknown"));

        String ext = getFileExtension(original);
        String folder = switch (ext) {
            case "jpg","jpeg","png","gif" -> "images";
            case "mp4","mov"              -> "videos";
            case "pdf","doc","docx","txt" -> "documents";
            default -> throw new UnsupportedMediaTypeException("Unsupported file type: " + contentType);
        };

        String key = String.format("%s-%s-%s",folder, UUID.randomUUID(), original);

        // Prepare s3 request
        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(contentType)
            .build();

        try {

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        } catch (IOException e) {
            throw new FileUploadException("File upload to Cloudflare R2 failed", e);
        }
        // Build and return the public URL
        String url = String.format(endpoint, accountId) + "/" + bucket + "/" + key;
        return url;
    }/*  */

    public String getPhotoUrl(String id) {
        // Build the public URL for the photo using its id (key)
        return String.format(endpoint, accountId) + "/" + bucket + "/" + id;
    }

    
    private String getFileExtension(String original) {
        int extIdx = original.lastIndexOf('.');
        if (extIdx < 0 || extIdx == original.length()-1) {
            throw new IllegalArgumentException("Invalid file extens " + original);
        }

        return original.substring(extIdx+1);
    }
    //ddddddddddddddddddddddddddddddddddd
    //dfdfds
}
