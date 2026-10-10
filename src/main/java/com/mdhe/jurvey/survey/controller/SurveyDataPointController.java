package com.mdhe.jurvey.survey.controller;

import com.mdhe.jurvey.survey.controller.types.AddTextDataPointRequest;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.service.SurveyDataPointService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/survey/datapoint")
@Tag(name = "Survey Datapoint API", description = "Api for managing datapoints of a survey")
@AllArgsConstructor
public class SurveyDataPointController {
    private final SurveyDataPointService surveyDataPointService;

    @PostMapping("/text")
    public DatapointDTO createTextDataPoint(@RequestBody AddTextDataPointRequest req){
        return surveyDataPointService.addTextDataPoint(req.surveyId,req.label);
    }

}
