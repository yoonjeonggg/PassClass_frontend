package app_programming_development.Class.repository;

import app_programming_development.Class.entity.ChapterProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChapterProgressRepository extends JpaRepository<ChapterProgress, Long> {
    Optional<ChapterProgress> findByUserIdAndChapterId(Long userId, Long chapterId);
}