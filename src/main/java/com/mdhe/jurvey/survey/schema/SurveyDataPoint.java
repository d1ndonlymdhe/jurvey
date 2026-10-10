package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(
        uniqueConstraints = @UniqueConstraint(
                name = "unique_datapoint_survey_label",
                columnNames = {"survey_id","label"}
        )
)
public class SurveyDataPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    private String id;

    @Getter
    @Setter
    @NotNull
    private String label;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    private SurveySchema survey;

    @Getter
    @CreatedDate
    private LocalDateTime createdAt;

    @Getter
    @LastModifiedDate
    private LocalDateTime updatedAt;
    public SurveyDataPoint(String label, SurveySchema survey){
        this.label = label;
        this.survey = survey;
    }

}
