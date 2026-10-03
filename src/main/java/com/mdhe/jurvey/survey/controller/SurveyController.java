package com.mdhe.jurvey.survey.controller;

import com.mdhe.jurvey.survey.controller.types.AddTextDataPointRequest;
import com.mdhe.jurvey.survey.controller.types.CreateSurveyRequest;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/survey")
public class SurveyController {

    private final SurveyService surveyService;

    @Autowired
    public SurveyController(SurveyService surveyService){
        this.surveyService = surveyService;
    }

    @GetMapping("/")
    public List<SurveySchema> getAllSurvey(){
        return this.surveyService.getAllSurvey();
    }

    @PostMapping("/")
    public SurveySchema createSurvey(@RequestBody CreateSurveyRequest req){
        return this.surveyService.createSurvey(req.name);
    }

    @PostMapping("/datapoint/text")
    public SurveySchema addTextDatapoint(@RequestBody AddTextDataPointRequest req){
        return this.surveyService.createSurveyDataPointText(req.surveyId,req.label);
    }
}
