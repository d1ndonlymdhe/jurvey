package com.mdhe.jurvey.survey.controller.types;

import jakarta.validation.constraints.NotNull;

public class AddTextDataPointRequest {
    @NotNull
    public String surveyId;
    @NotNull
    public String label;
}
