package com.mdhe.jurvey.survey.controller.types.Survey;


import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BasicSurveyResDTO {
    @NotNull
    public String id;
    @NotNull
    public String name;
    @NotNull
    public long questionCount;
    @NotNull
    public String title;
    @NotNull
    public String description;
}
