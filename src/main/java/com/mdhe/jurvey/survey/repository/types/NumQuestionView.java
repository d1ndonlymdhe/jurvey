package com.mdhe.jurvey.survey.repository.types;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class NumQuestionView {
    public String surveyId;
    public long numQuestions;
}
