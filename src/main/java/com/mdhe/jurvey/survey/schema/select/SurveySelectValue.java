package com.mdhe.jurvey.survey.schema.select;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveySelectValue
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    private String id;

    @Getter
    @Setter
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @Getter
    @Setter
    private SurveyDataPoint selectDataPoint;

    public SurveySelectValue(String value){
        this.value = value;
    }
}
