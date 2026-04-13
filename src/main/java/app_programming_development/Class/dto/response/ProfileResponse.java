package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.Users;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileResponse {
    private Long id;
    private String nickname;
    private String profileImage;

    public static ProfileResponse from(Users user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .profileImage(user.getProfileUrl())
                .build();
    }
}
