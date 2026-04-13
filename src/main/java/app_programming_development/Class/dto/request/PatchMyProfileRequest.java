package app_programming_development.Class.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PatchMyProfileRequest {
    private String nickname;
    private String profileImage;
}
