package app_programming_development.Class.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Problems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="certificate_id", nullable = false)
    private Certificates certificates;

    @ManyToOne
    @JoinColumn(name="creator_id", nullable = false)
    private Users user;

    @Column(name="content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name="option1")
    private String option1;

    @Column(name="option2")
    private String option2;

    @Column(name="option3")
    private String option3;

    @Column(name="option4")
    private String option4;

    @Column(name="correct_answer", nullable = false)
    private int correctAnswer;

    @Column(name="explanation", columnDefinition = "TEXT")
    private String explanation;

    @CreatedDate
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

}
