package com.mdhe.jurvey.survey.controller;

import com.mdhe.jurvey.survey.controller.types.AddTextDataPointRequest;
import com.mdhe.jurvey.survey.controller.types.CreateSurveyRequest;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.controller.types.Survey.BasicSurveyResDTO;
import com.mdhe.jurvey.survey.controller.types.Survey.DetailedSurveyResDTO;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.service.SurveyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/survey")
@Tag(name="Survey API", description="Survey Management API")
public class SurveyController {

    private final SurveyService surveyService;

    @Autowired
    public SurveyController(SurveyService surveyService){
        this.surveyService = surveyService;
    }

    @GetMapping("")
    public List<BasicSurveyResDTO> getAllSurvey(){
        return surveyService.getAllSurvey();
    }

    @GetMapping("/{id}")
    public DetailedSurveyResDTO getSurvey(@PathVariable String id){
        return surveyService.getSurvey(id);
    }

    @PostMapping("/")
    public BasicSurveyResDTO createSurvey(@RequestBody CreateSurveyRequest req){
        return surveyService.createSurvey(req.name,req.title,req.description);
    }

}
