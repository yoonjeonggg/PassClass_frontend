package app_programming_development.Class.repository;

import app_programming_development.Class.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Reviews, Long> {
    @Query("SELECT AVG(r.rating) FROM Reviews r WHERE r.lectures.id = :lectureId")
    Double getAverageRating(@Param("lectureId") Long lectureId);
}
