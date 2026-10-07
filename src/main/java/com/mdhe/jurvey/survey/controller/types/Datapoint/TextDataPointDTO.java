package com.mdhe.jurvey.survey.controller.types.Datapoint;

import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;

public class TextDataPointDTO extends DatapointDTO {
    public TextDataPointDTO(SurveyDataPointText textDatapoint) {
        super(textDatapoint);
    }
}
