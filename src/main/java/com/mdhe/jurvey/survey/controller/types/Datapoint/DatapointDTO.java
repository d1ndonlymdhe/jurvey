package com.mdhe.jurvey.survey.controller.types.Datapoint;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import jakarta.validation.constraints.NotNull;

@JsonTypeInfo(
        use= JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes(
        {
                @JsonSubTypes.Type(value = TextDataPointDTO.class, name = "text"),
                @JsonSubTypes.Type(value = SelectDataPointDTO.class, name = "select")
        }
)
public abstract class DatapointDTO {
    @NotNull
    public String id;
    @NotNull
    public String label;
    @NotNull
    public String surveyId;

    public DatapointDTO(SurveyDataPoint dataPoint){
        this.id = dataPoint.getId();
        this.label = dataPoint.getLabel();
        this.surveyId = dataPoint.getSurvey().getId();
    }

}
