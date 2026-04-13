package app_programming_development.Class.controller;

import app_programming_development.Class.dto.request.CertificateRequest;
import app_programming_development.Class.dto.response.CertificateResponse;
import app_programming_development.Class.global.ApiResponse;
import app_programming_development.Class.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificate", description = "자격증 관련 API")
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping
    @Operation(summary = "자격증 등록", description = "자격증 등록 시 사용하는 API 입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자만 자격증을 등록할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<CertificateResponse>> createCertificate(
            @RequestBody CertificateRequest request) {

        CertificateResponse result = certificateService.createCertificate(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "등록되었습니다."));
    }

    @GetMapping
    @Operation(summary = "자격증 목록 조회", description = "자격증 목록 조회 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공")
    })
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getCertificates() {

        List<CertificateResponse> result = certificateService.getCertificates();
        return ResponseEntity.ok(ApiResponse.ok(result, "조회되었습니다."));
    }

    @GetMapping("/search")
    @Operation(summary = "자격증 검색", description = "자격증 검색 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공")
    })
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> searchCertificates(
            @RequestParam String keyword) {

        List<CertificateResponse> result = certificateService.searchCertificates(keyword);
        return ResponseEntity.ok(ApiResponse.ok(result, "검색되었습니다."));
    }

    @PutMapping("/{id}")
    @Operation(summary = "자격증 수정", description = "자격증 수정 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자만 자격증을 수정할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "자격증을 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<CertificateResponse>> updateCertificate(
            @PathVariable Long id,
            @RequestBody CertificateRequest request) {

        CertificateResponse result = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "수정되었습니다."));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "자격증 삭제", description = "자격증 삭제 시 사용하는 API 입니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "요청 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자만 자격증을 삭제할 수 있습니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "로그인이 필요합니다.", content = @Content),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "자격증을 찾을 수 없습니다.", content = @Content)
    })
    public ResponseEntity<ApiResponse<Void>> deleteCertificate(@PathVariable Long id) {

        certificateService.deleteCertificate(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제되었습니다."));
    }
}