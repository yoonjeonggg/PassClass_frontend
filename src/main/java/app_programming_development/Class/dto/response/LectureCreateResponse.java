package app_programming_development.Class.dto.response;

import app_programming_development.Class.dto.info.CertificateInfo;
import app_programming_development.Class.entity.Lectures;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
@AllArgsConstructor
public class LectureCreateResponse {

    private Long id;
    private String title;
    private String category;
    private String thumbnailUrl;
    private String description;

    private String instructorNickname;
    private String instructorProfileImage;
    private CertificateInfo certificate;



    public static LectureCreateResponse from(Lectures lecture) {
        return LectureCreateResponse.builder()
                .id(lecture.getId())
                .title(lecture.getTitle())
                .category(lecture.getCategory())
                .thumbnailUrl(lecture.getThumbnailUrl())
                .description(lecture.getDescription())
                .instructorNickname(lecture.getInstructor().getNickname())
                .instructorProfileImage(lecture.getInstructor().getProfileUrl())
                .certificate(CertificateInfo.builder()
                        .id(lecture.getCertificates().getId())
                        .name(lecture.getCertificates().getName())
                        .build())
                .build();
    }
}
