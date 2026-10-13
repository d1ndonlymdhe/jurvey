package com.mdhe.jurvey.survey.service;

import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointMapper;
import com.mdhe.jurvey.survey.controller.types.Survey.BasicSurveyResDTO;
import com.mdhe.jurvey.survey.controller.types.Survey.DetailedSurveyResDTO;
import com.mdhe.jurvey.survey.repository.SurveyDataPointRepository;
import com.mdhe.jurvey.survey.repository.SurveyRepository;
import com.mdhe.jurvey.survey.repository.types.NumQuestionView;
import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyDataPointRepository surveyDataPointRepository;

    public BasicSurveyResDTO createSurvey(String name, String title, String description) {
        var existing = this.surveyRepository.findFirstByName(name);
        if (existing.isPresent()) {
            throw new RuntimeException("Survey already exists");
        }
        var newSurvey = surveyRepository.save(new SurveySchema(name, title, description));
        return toBasicSurveyDTO(newSurvey, Map.of(newSurvey.getId(), 0L));
    }

    public List<BasicSurveyResDTO> getAllSurvey() {
        var allSurvey = surveyRepository.findAll();
        var surveyIds = allSurvey.stream().map(SurveySchema::getId).toList();
        var surveyIdToCountMap = surveyDataPointRepository.countBySurveyIds(surveyIds).stream().collect(Collectors.toMap(NumQuestionView::getSurveyId, NumQuestionView::getNumQuestions));
        return allSurvey.stream().map(survey -> toBasicSurveyDTO(survey, surveyIdToCountMap)).toList();
    }

    public DetailedSurveyResDTO getSurvey(String id) {
        return toDetailedSurveyDTO(getSurveyById(id));
    }

    protected SurveySchema getSurveyById(String surveyId) {
        return surveyRepository.findById(surveyId).orElseThrow(() -> new RuntimeException("Survey Not Found"));
    }

    protected BasicSurveyResDTO toBasicSurveyDTO(SurveySchema survey, Map<String, Long> counts) {
        return BasicSurveyResDTO
                .builder()
                .id(survey.getId())
                .name(survey.getName())
                .questionCount(counts.getOrDefault(survey.getId(), 0L))
                .title(survey.getTitle()).
                description(survey.getDescription())
                .build();
    }

    protected DetailedSurveyResDTO toDetailedSurveyDTO(SurveySchema schema) {
        var dataPointDtoList = schema
                .getDataPointList()
                .stream()
                .map(SurveyDataPointService::toDataPointDTO)
                .toList();
        return DetailedSurveyResDTO.builder()
                .id(schema.getId())
                .name(schema.getName())
                .questionCount(schema.getDataPointList().size())
                .dataPoints(dataPointDtoList)
                .title(schema.getTitle())
                .description(schema.getDescription())
                .build();
    }

}
