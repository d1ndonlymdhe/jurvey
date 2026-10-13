package com.mdhe.jurvey.survey.service;

import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointMapper;
import com.mdhe.jurvey.survey.repository.SurveyDataPointRepository;
import com.mdhe.jurvey.survey.repository.SurveyRepository;
import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SurveyDataPointService {
    private final SurveyDataPointRepository surveyDataPointRepository;
    private final SurveyRepository surveyRepository;

    private final SurveySelectValueService surveySelectValueService;
    private final SurveyService surveyService;

    public void checkDataPointExists(String surveyId, String label){
        var optionalSurvey = surveyRepository.findById(surveyId);
        if(optionalSurvey.isEmpty()){
            throw  new RuntimeException("Survey not found");
        }
        var exists = surveyDataPointRepository.existsBySurveyIdAndLabel(surveyId,label);
        if(exists){
            throw new RuntimeException("Datapoint with name already exists");
        }
    }

    @Transactional
    public DatapointDTO addTextDataPoint(String surveyId, String label){
        checkDataPointExists(surveyId,label);
        var survey = surveyService.getSurveyById(surveyId);
        var textSurveyDataPoint = new SurveyDataPointText(label,survey);
        log.debug("Save text datapoint");
        surveyDataPointRepository.save(textSurveyDataPoint);
        log.debug("Complete save text datapoint");
        return toDataPointDTO(textSurveyDataPoint);
    }

    @Transactional
    public DatapointDTO addSelectDataPoint(String surveyId, String label, List<String> allowedValues){
        checkDataPointExists(surveyId,label);
        var survey = surveyService.getSurveyById(surveyId);
        var selectSurveyDataPoint = new SurveyDataPointSelect(label,survey);
        surveyDataPointRepository.save(selectSurveyDataPoint);
        var createdAllowedValues = surveySelectValueService.createMultiple(selectSurveyDataPoint.getId(),allowedValues);
        selectSurveyDataPoint.getAllowedValues().addAll(createdAllowedValues);
        return toDataPointDTO(selectSurveyDataPoint);
    }

    protected static DatapointDTO toDataPointDTO(SurveyDataPoint surveyDataPoint) {
        return DatapointMapper.toDto(surveyDataPoint);
    }
}
