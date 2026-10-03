package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveySchema {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    private String Id;

    @Getter
    @Setter
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
