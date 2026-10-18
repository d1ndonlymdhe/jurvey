package com.mdhe.jurvey.survey.controller.types.Survey;

import java.util.List;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DetailedSurveyResDTO extends BasicSurveyResDTO{
    @NotNull
    public List<DatapointDTO> dataPoints;
}
