package com.mdhe.jurvey.survey.schema.select;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveyDataPointType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveyDataPointSelect extends SurveyDataPoint {
    @Getter
    @Setter
    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "selectDataPoint"
    )
    private List<SurveySelectValue> allowedValues;

    public SurveyDataPointSelect(String label,List<String> allowedValues){
        super(label, SurveyDataPointType.SELECT);
        this.allowedValues = allowedValues.stream().map(SurveySelectValue::new).toList();
    }
}
