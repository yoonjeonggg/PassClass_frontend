package app_programming_development.Class.dto.response;

import app_programming_development.Class.entity.Users;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyProfileResponse {
    private Long id;
    private String email;
    private String nickname;
    private String profileImage;

    public static MyProfileResponse from(Users user) {
        return MyProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileUrl())
                .build();
    }
}
