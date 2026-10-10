package com.mdhe.jurvey.survey.controller.types;

import jakarta.validation.constraints.NotNull;

public class CreateSurveyRequest {
    @NotNull
    public String name;

    @NotNull
    public String title;

    @NotNull
    public String description;
}
