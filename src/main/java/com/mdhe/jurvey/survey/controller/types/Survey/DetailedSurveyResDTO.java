package com.mdhe.jurvey.survey.controller.types.Survey;

import java.util.List;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointMapper;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import jakarta.validation.constraints.NotNull;

public class DetailedSurveyResDTO extends BasicSurveyResDTO{
    @NotNull
    public List<DatapointDTO> dataPoints;

    public DetailedSurveyResDTO(SurveySchema survey){
        super(survey);
        this.dataPoints = survey.getDataPointList().stream().map(DatapointMapper::toDto).toList();
    }
}
