package com.mdhe.jurvey.survey.schema.select;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveyDataPointType;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveyDataPointSelect extends SurveyDataPoint {
    @Getter
    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "selectDataPoint",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<SurveySelectValue> allowedValues = new ArrayList<>();

    public SurveyDataPointSelect(String label, SurveySchema survey){
        super(label, survey);
        this.allowedValues = new ArrayList<>();
        survey.getDataPointList().add(this);
    }
}
