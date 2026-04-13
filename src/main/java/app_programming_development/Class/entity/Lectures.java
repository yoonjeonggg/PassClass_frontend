package app_programming_development.Class.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "lectures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Lectures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="instructor_id", nullable = false)
    private Users instructor;

    @ManyToOne
    @JoinColumn(name="certificate_id", nullable = false)
    private Certificates certificates;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name = "like_count")
    private Integer likeCount;

    @Column(name="description", columnDefinition = "TEXT")
    private String description;

    @Column(name="category")
    private String category;

    @Column(name="thumbnail_url")
    private String thumbnailUrl;

    @CreatedDate
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
