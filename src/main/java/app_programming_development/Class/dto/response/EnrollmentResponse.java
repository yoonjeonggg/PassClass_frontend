package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.Enrollments;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EnrollmentResponse {
    private Long enrollmentId;
    private Long lectureId;
    private String lectureTitle;
    private LocalDateTime createdAt;

    public static EnrollmentResponse from(Enrollments enrollment) {
        return EnrollmentResponse.builder()
                .enrollmentId(enrollment.getId())
                .lectureId(enrollment.getLectures().getId())
                .lectureTitle(enrollment.getLectures().getTitle())
                .createdAt(enrollment.getCreatedAt())
                .build();
    }
}
