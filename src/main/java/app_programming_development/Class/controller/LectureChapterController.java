package app_programming_development.Class.controller;

import app_programming_development.Class.dto.request.LectureChapterRequest;
import app_programming_development.Class.dto.response.LectureChapterResponse;
import app_programming_development.Class.global.ApiResponse;
import app_programming_development.Class.service.LectureChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecture/chapters")
@RequiredArgsConstructor
@Tag(name = "LectureChapter", description = "강의 챕터 관련 API")
public class LectureChapterController {

    private final LectureChapterService lectureChapterService;

    @PostMapping
    @Operation(summary = "강의 챕터 등록", description = "강의 챕터 등록 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "강사만 챕터를 등록할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 강의를 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<LectureChapterResponse>> createChapter(
            @RequestBody LectureChapterRequest request) {
        LectureChapterResponse result = lectureChapterService.createChapter(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "등록되었습니다."));
    }

    @PutMapping("/{chapterId}")
    @Operation(summary = "강의 챕터 수정", description = "강의 챕터 수정 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "강사만 챕터를 수정할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 챕터를 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<LectureChapterResponse>> updateChapter(
            @PathVariable Long chapterId,
            @RequestBody LectureChapterRequest request) {
        LectureChapterResponse result = lectureChapterService.updateChapter(chapterId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "수정되었습니다."));
    }

    @DeleteMapping("/{chapterId}")
    @Operation(summary = "강의 챕터 삭제", description = "강의 챕터 삭제 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "강사만 챕터를 삭제할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 챕터를 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<Void>> deleteChapter(
            @PathVariable Long chapterId) {
        lectureChapterService.deleteChapter(chapterId);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제되었습니다."));
    }

    @GetMapping
    @Operation(summary = "강의 챕터 목록 조회", description = "강의 챕터 목록 조회 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 강의를 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<List<LectureChapterResponse>>> getChapters(
            @RequestParam Long lectureId) {
        List<LectureChapterResponse> result = lectureChapterService.getChapters(lectureId);
        return ResponseEntity.ok(ApiResponse.ok(result, "조회되었습니다."));
    }
}
