package app_programming_development.Class.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ChapterDto {

    private Long id;
    private String title;
    private Integer order;
}
