package com.mdhe.jurvey.survey.controller.types.Datapoint;

import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.select.SurveySelectValue;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SelectDataPointDTO extends DatapointDTO{
    @NotNull
    public List<String> allowedValues;
    public SelectDataPointDTO(SurveyDataPointSelect dataPointSelect){
        super(dataPointSelect);
        this.allowedValues = dataPointSelect.getAllowedValues().stream().map(SurveySelectValue::getValue).toList();
    }
}
