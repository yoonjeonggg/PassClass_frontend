package app_programming_development.Class.controller;

import app_programming_development.Class.dto.response.EnrollmentResponse;
import app_programming_development.Class.global.ApiResponse;
import app_programming_development.Class.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@RequiredArgsConstructor
@Tag(name = "Enrollment", description = "수강 신청 관련 API")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/{lectureId}")
    @Operation(summary = "수강 신청", description = "강의 수강 신청 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 강의를 찾을 수 없습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "이미 수강 신청된 강의입니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @PathVariable Long lectureId) {
        EnrollmentResponse result = enrollmentService.enroll(lectureId);
        return ResponseEntity.ok(ApiResponse.ok(result, "수강 신청되었습니다."));
    }

    @DeleteMapping("/{lectureId}")
    @Operation(summary = "수강 취소", description = "수강 취소 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "수강 내역을 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<Void>> cancelEnrollment(
            @PathVariable Long lectureId) {
        enrollmentService.cancelEnrollment(lectureId);
        return ResponseEntity.ok(ApiResponse.ok(null, "수강 취소되었습니다."));
    }

    @GetMapping("/me")
    @Operation(summary = "내 수강 목록 조회", description = "내 수강 목록 조회 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments() {
        List<EnrollmentResponse> result = enrollmentService.getMyEnrollments();
        return ResponseEntity.ok(ApiResponse.ok(result, "조회되었습니다."));
    }
}
