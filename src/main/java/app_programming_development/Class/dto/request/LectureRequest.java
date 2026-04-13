package app_programming_development.Class.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LectureRequest {

    @NotBlank(message = "자격증을 입력해주세요.")
    private Long certificateId;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    private String description;

    private String category;

    private String thumbnailUrl;
}
