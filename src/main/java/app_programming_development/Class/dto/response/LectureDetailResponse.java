package app_programming_development.Class.dto.response;

import app_programming_development.Class.dto.info.CertificateInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class LectureDetailResponse {
    private Long id;
    private String title;
    private String category;
    private String thumbnailUrl;
    private String description;

    private Double rating;
    private Long likeCount;
    private Long studentCount;
    private Integer chapterCount;

    private InstructorDto instructor;

    private List<ChapterDto> chapters;
    private CertificateInfo certificate;

}
