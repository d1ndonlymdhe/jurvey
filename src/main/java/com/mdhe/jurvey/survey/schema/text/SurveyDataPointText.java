package com.mdhe.jurvey.survey.schema.text;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveyDataPointType;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurveyDataPointText extends SurveyDataPoint
{
    public SurveyDataPointText(String label, SurveySchema survey){
        super(label, survey,SurveyDataPointType.TEXTBOX);
    }

}
