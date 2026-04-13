package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.LectureChapters;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LectureChapterResponse {
    private Long id;
    private Long lectureId;
    private String title;
    private String videoUrl;
    private int chapterOrder;

    public static LectureChapterResponse from(LectureChapters chapter) {
        return LectureChapterResponse.builder()
                .id(chapter.getId())
                .lectureId(chapter.getLectures().getId())
                .title(chapter.getTitle())
                .videoUrl(chapter.getVideoUrl())
                .chapterOrder(chapter.getChapterOrder())
                .build();
    }
}
