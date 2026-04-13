package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.LectureChapters;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChapterWatchResponse {
    private Long id;
    private String title;
    private String videoUrl;     // 수강생만 받을 수 있음
    private Integer chapterOrder;
    private boolean completed;   // 내 시청 완료 여부

    public static ChapterWatchResponse of(LectureChapters chapter, boolean completed) {
        return ChapterWatchResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .videoUrl(chapter.getVideoUrl())
                .chapterOrder(chapter.getChapterOrder())
                .completed(completed)
                .build();
    }
}
