package app_programming_development.Class.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "mock_exams_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class MockExamQuestions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="mock_exam_id", nullable = false)
    private MockExams mockExams;

    @ManyToOne
    @JoinColumn(name="problem_id", nullable = false)
    private Problems problems;
}
