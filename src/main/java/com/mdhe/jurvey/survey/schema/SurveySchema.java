package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveySchema {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @NotNull
    private String id;

    @Getter
    @Setter
    @NotNull
    private String name;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "survey",
            fetch = FetchType.LAZY
    )
    @Getter
    @Setter
    private List<SurveyDataPoint> dataPointList;

    public SurveySchema(String name) {
        this.name = name;
    }

    public void addDataPoint(SurveyDataPoint dataPoint) {
        if (this.dataPointList.stream().noneMatch(item -> item.getLabel().equals(dataPoint.getLabel()) || item.getId().equals(dataPoint.getId()))) {
            this.dataPointList.add(dataPoint);
        }
    }
}
