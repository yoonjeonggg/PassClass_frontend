package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.Certificates;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CertificateResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public static CertificateResponse from(Certificates certificate) {
        return CertificateResponse.builder()
                .id(certificate.getId())
                .name(certificate.getName())
                .description(certificate.getDescription())
                .createdAt(certificate.getCreatedAt())
                .build();
    }
}
