package com.mdhe.jurvey.survey.service;

import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointDTO;
import com.mdhe.jurvey.survey.controller.types.Datapoint.DatapointMapper;
import com.mdhe.jurvey.survey.controller.types.Datapoint.SelectDataPointDTO;
import com.mdhe.jurvey.survey.controller.types.Datapoint.TextDataPointDTO;
import com.mdhe.jurvey.survey.controller.types.Survey.BasicSurveyResDTO;
import com.mdhe.jurvey.survey.controller.types.Survey.DetailedSurveyResDTO;
import com.mdhe.jurvey.survey.repository.SurveyDataPointRepository;
import com.mdhe.jurvey.survey.repository.SurveyRepository;
import com.mdhe.jurvey.survey.repository.types.NumQuestionView;
import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import com.mdhe.jurvey.survey.schema.SurveySchema;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.select.SurveySelectValue;
import com.mdhe.jurvey.survey.schema.text.SurveyDataPointText;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyDataPointRepository surveyDataPointRepository;



    protected SurveySchema assertSurveyExists(String id){
        var existing = this.surveyRepository.findById(id);
        if(existing.isEmpty()){
            throw new RuntimeException("Survey does not exist");
        }
        return existing.get();
    }
    protected void assertSurveyNameDoesntExist(String name){
        var existing = this.surveyRepository.findFirstByName(name);
        if(existing.isPresent()){
            throw new RuntimeException("Survey with title already exists");
        }
    }
    @Transactional
    public BasicSurveyResDTO createSurvey(String name, String title, String description) {
        this.assertSurveyNameDoesntExist(name);
        var newSurvey = surveyRepository.save(new SurveySchema(name, title, description));
        return toBasicSurveyDTO(newSurvey, Map.of(newSurvey.getId(), 0L));
    }

    @Transactional
    public DetailedSurveyResDTO createSurveyFromDraft(DetailedSurveyResDTO draftSurvey){
        String surveyName = draftSurvey.name;

        this.assertSurveyNameDoesntExist(surveyName);

        String surveyTitle = draftSurvey.title;
        String surveyDescription = draftSurvey.description;

        SurveySchema newSurvey = new SurveySchema(surveyName,surveyTitle,surveyDescription);
        List<DatapointDTO> dataPoints = draftSurvey.dataPoints;
        for (DatapointDTO dp: dataPoints){
            SurveyDataPointService.fromDto(dp,newSurvey);
        }
        surveyRepository.save(newSurvey);
        var savedOptional = surveyRepository.findById(newSurvey.getId());
        if(savedOptional.isEmpty()){
            throw new RuntimeException("Something went wrong while saving");
        }
        return toDetailedSurveyDTO(savedOptional.get());
    }

    @Transactional
    public DetailedSurveyResDTO updateSurveyFromDraft(DetailedSurveyResDTO draftSurvey){
        String surveyId = draftSurvey.id;

        SurveySchema existing = this.assertSurveyExists(surveyId);

        String surveyName = draftSurvey.name;
        String surveyDescription = draftSurvey.description;
        String surveyTitle = draftSurvey.title;

        existing.setName(surveyName);
        existing.setDescription(surveyDescription);
        existing.setTitle(surveyTitle);

        var draftDatapoints = draftSurvey.dataPoints;
        // Ensure all labels are unique
        var asSet =  draftDatapoints.stream().map(d->d.label).collect(Collectors.toSet());
        if(asSet.size() != draftDatapoints.size()){
            throw new RuntimeException("All labels should be unique");
        }

        Map<String,DatapointDTO> draftDatapointsAsMap = draftSurvey.dataPoints.stream().collect(Collectors.toMap(d->d.id,d->d));

        Map<String,SurveyDataPoint> datapointsToEditMap = new HashMap<>();

        List<String> dataPointIdsToFetchFromDB = new ArrayList<>();
        for (var draftDataPoint : draftDatapoints){
            if(draftDataPoint.id!=null && !draftDataPoint.id.isEmpty()){
                dataPointIdsToFetchFromDB.add(draftDataPoint.id);
            }else{
                datapointsToEditMap.put(draftDataPoint.id, SurveyDataPointService.fromDto(draftDataPoint,existing));
            }
        }

        datapointsToEditMap.putAll(
                surveyDataPointRepository.findByIdInAndSurveyId(dataPointIdsToFetchFromDB,existing.getId())
                        .stream()
                        .collect(Collectors.toMap(SurveyDataPoint::getId, dataPoint-> dataPoint))
        );

        datapointsToEditMap.forEach((dataPointId,surveyDataPoint)->{
            var draftForId = draftDatapointsAsMap.get(dataPointId);
            surveyDataPoint.setLabel(draftForId.label);
        });


        surveyRepository.save(existing);

        Optional<SurveySchema> result = surveyRepository.findById(surveyId);

        if(result.isEmpty()){
            throw new RuntimeException("Error saving survey");
        }
        return toDetailedSurveyDTO(result.get());
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
