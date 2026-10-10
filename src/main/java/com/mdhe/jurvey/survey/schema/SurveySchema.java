package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class SurveySchema {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    private String id;

    @Getter
    @Setter
    @NotNull
    private String name;

    @Getter
    @Setter
    @NotNull
    private String title;

    @Getter
    @Setter
    @NotNull
    private String description;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "survey",
            fetch = FetchType.LAZY
    )
    @Getter
    private List<SurveyDataPoint> dataPointList;

    @CreatedDate
    @Getter
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Setter
    private LocalDateTime updatedAt;

    public SurveySchema(String name, String title, String description) {
        this.name = name;
        this.title = title;
        this.description = description;
    }
}
