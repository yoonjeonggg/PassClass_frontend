package app_programming_development.Class.repository;

import app_programming_development.Class.entity.RefreshTokens;
import app_programming_development.Class.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokens, Long> {

    // 유저의 기존 토큰 삭제
    void deleteByUser(Users user);

    Optional<RefreshTokens> findByToken(String token);
}
