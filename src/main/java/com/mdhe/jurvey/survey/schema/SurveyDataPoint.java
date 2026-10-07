package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveyDataPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @NotNull
    private String id;

    @Getter
    @NotNull
    private SurveyDataPointType type;

    @Getter
    @Setter
    @NotNull
    private String label;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    private SurveySchema survey;

    public SurveyDataPoint(String label, SurveySchema survey, SurveyDataPointType type){
        this.label = label;
        this.type = type;
        this.survey = survey;
    }

}
