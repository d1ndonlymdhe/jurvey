package com.mdhe.jurvey.survey.controller.types.Survey;

import com.mdhe.jurvey.survey.schema.SurveySchema;

public class BasicSurveyResDTO {
    public String id;
    public String name;

    public BasicSurveyResDTO(SurveySchema survey){
        this.id = survey.getId();
        this.name = survey.getName();
    }
}
