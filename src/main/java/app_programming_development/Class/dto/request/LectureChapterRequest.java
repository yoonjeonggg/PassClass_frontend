package app_programming_development.Class.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LectureChapterRequest {
    private Long lectureId;
    private String title;
    private String videoUrl;
    private int chapterOrder;
}
