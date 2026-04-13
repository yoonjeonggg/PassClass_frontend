package app_programming_development.Class.controller;

import app_programming_development.Class.dto.request.AutoLoginRequest;
import app_programming_development.Class.dto.request.LoginRequest;
import app_programming_development.Class.dto.request.SignupRequest;
import app_programming_development.Class.dto.response.SignupResponse;
import app_programming_development.Class.dto.response.TokenResponse;
import app_programming_development.Class.global.ApiResponse;
import app_programming_development.Class.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "로그인 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "요청 성공"
            ), @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "비밀번호가 일치하지 않습니다.",
            content = @Content
    ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "계정이 존재하지 않습니다.",
                    content = @Content
            )
    })
    public ResponseEntity<ApiResponse<TokenResponse>> login(@RequestBody LoginRequest request) {
        TokenResponse result = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "로그인 되었습니다."));
    }

    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "회원가입 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "요청 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "409", description = "이미 존재하는 계정 입니다.",
                content = @Content
            )
    })
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@RequestBody SignupRequest request) {
        SignupResponse result = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "회원가입 되었습니다."));
    }

    @PostMapping("/auto-login")
    @Operation(summary = "자동 로그인", description = "리프레시 토큰을 넣으면 엑세스 토큰을 반환 해줍니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "요청 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "유효하지 않은 리프레시 토큰 입니다.",
                    content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "계정이 존재하지 않습니다.",
                    content = @Content
            )
    })
    public ResponseEntity<ApiResponse<TokenResponse>> autoLogin(@RequestBody AutoLoginRequest request) {
        TokenResponse result = authService.autoLogin(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "로그인 되었습니다."));
    }

    @PostMapping("/log-out")
    @Operation(summary = "로그아웃", description = "엑세스 토큰을 넣으면 로그아웃이 됩니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "요청 성공"
            ), @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "로그인이 필요합니다.",
            content = @Content)
    })
        public ResponseEntity<ApiResponse<Void>> logOut() {
            authService.logOut();
        return ResponseEntity.ok(ApiResponse.ok("로그아웃 되었습니다."));
    }



}



