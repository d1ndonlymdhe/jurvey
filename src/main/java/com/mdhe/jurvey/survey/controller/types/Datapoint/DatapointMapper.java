package com.mdhe.jurvey.survey.controller.types.Datapoint;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;
import org.w3c.dom.Text;

import java.util.Objects;

public final class DatapointMapper {
    public static DatapointDTO toDto(SurveyDataPoint dataPoint){
        if(dataPoint instanceof SurveyDataPointText){
            return new TextDataPointDTO((SurveyDataPointText) dataPoint);
        }
        if(dataPoint instanceof SurveyDataPointSelect){
            return new SelectDataPointDTO((SurveyDataPointSelect) dataPoint);
        }
        throw new RuntimeException("Unhandled SurveyDataPoint type");
    }
}
