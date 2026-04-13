package app_programming_development.Class.repository;

import app_programming_development.Class.entity.LectureLikes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureLikeRepository extends JpaRepository<LectureLikes, Long> {
    Long countByLectures_Id(Long lectureId);
}
