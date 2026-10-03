package com.mdhe.jurvey.survey.schema;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveyDataPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    private String id;

    @Getter
    private SurveyDataPointType type;

    @Getter
    @Setter
    private String label;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    private SurveySchema survey;

    public SurveyDataPoint(String label, SurveyDataPointType type){
        this.label = label;
        this.type = type;
    }

}
