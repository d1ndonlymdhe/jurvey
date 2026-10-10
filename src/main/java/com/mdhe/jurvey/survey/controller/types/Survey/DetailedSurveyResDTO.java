package com.mdhe.jurvey.survey.controller.types.Survey;

import java.util.List;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class DetailedSurveyResDTO extends BasicSurveyResDTO{
    @NotNull
    public List<DatapointDTO> dataPoints;
}
