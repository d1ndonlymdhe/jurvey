package com.mdhe.jurvey.survey.service;

import com.mdhe.jurvey.survey.repository.SurveyDataPointRepository;
import com.mdhe.jurvey.survey.repository.SurveyRepository;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyDataPointRepository surveyDataPointRepository;

    @Autowired
    public SurveyService(SurveyRepository surveyRepository, SurveyDataPointRepository surveyDataPointRepository) {
        this.surveyRepository = surveyRepository;
        this.surveyDataPointRepository = surveyDataPointRepository;
    }

    public SurveySchema createSurvey(String name) {
        var existing = this.surveyRepository.findFirstByName(name);
        if(existing.isPresent()){
            throw new RuntimeException("Survey already exists");
        }
        return surveyRepository.save(new SurveySchema(name));
    }

    public SurveySchema createSurveyDataPointText(String surveyId, String label) {
        var surveyRef = surveyRepository.getReferenceById(surveyId);
        var dataPoint = new SurveyDataPointText(label,surveyRef);
        surveyRef.addDataPoint(dataPoint);
        return surveyRepository.save(surveyRef);
    }

    public SurveySchema createSurveyDataPointSelect(String surveyId, String label, List<String> allowedValues) {
        var surveyRef = surveyRepository.getReferenceById(surveyId);
        var dataPoint = new SurveyDataPointSelect(label, surveyRef, allowedValues);
        surveyRef.addDataPoint(dataPoint);
        return surveyRepository.save(surveyRef);
    }

    public List<SurveySchema> getAllSurvey() {
        return surveyRepository.findAll();
    }

    public SurveySchema getSurvey(String id){
        var surveySchema = surveyRepository.findById(id);
        if (surveySchema.isEmpty()){
            throw new RuntimeException("Survey not found");
        }
        return surveySchema.get();
    }

}
