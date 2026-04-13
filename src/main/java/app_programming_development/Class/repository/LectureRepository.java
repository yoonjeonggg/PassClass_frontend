package app_programming_development.Class.repository;

import app_programming_development.Class.entity.Lectures;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LectureRepository extends JpaRepository<Lectures, Long> {
    Page<Lectures> findByCategory(String category, Pageable pageable);
}
