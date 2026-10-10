package com.mdhe.jurvey.survey.controller.types.Survey;


import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class BasicSurveyResDTO {
    @NotNull
    public String id;
    @NotNull
    public String name;
    @NotNull
    public long questionCount;
}
