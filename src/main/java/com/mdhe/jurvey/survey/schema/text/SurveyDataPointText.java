package com.mdhe.jurvey.survey.schema.text;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveyDataPointType;
import jakarta.persistence.*;

@Entity
public class SurveyDataPointText extends SurveyDataPoint
{
    public SurveyDataPointText(String label){
        super(label, SurveyDataPointType.TEXTBOX);
    }

    public SurveyDataPointText() {}
}
