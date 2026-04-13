package app_programming_development.Class.dto.response;

import app_programming_development.Class.dto.info.CertificateInfo;
import app_programming_development.Class.entity.Lectures;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LectureListDto {
    private Long id;
    private String title;
    private String category;
    private String thumbnailUrl;
    private Double rating;
    private CertificateInfo certificate;
    public static LectureListDto from(Lectures lecture, Double rating) {
        return LectureListDto.builder()
                .id(lecture.getId())
                .title(lecture.getTitle())
                .category(lecture.getCategory())
                .thumbnailUrl(lecture.getThumbnailUrl())
                .certificate(CertificateInfo.builder()
                        .id(lecture.getCertificates().getId())
                        .name(lecture.getCertificates().getName())
                        .build())
                .rating(rating)
                .build();
    }
}
