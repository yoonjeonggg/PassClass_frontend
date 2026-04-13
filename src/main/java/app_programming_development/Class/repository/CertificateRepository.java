package app_programming_development.Class.repository;

import app_programming_development.Class.entity.Certificates;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificates, Long> {
    List<Certificates> findByNameContainingIgnoreCase(String keyword);
}
