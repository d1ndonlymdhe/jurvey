package com.mdhe.jurvey.survey.service;

import com.mdhe.jurvey.survey.repository.SurveyDataPointRepository;
import com.mdhe.jurvey.survey.repository.SurveySelectValueRepository;
import com.mdhe.jurvey.survey.schema.SurveyDataPointType;
import com.mdhe.jurvey.survey.schema.select.SurveyDataPointSelect;
import com.mdhe.jurvey.survey.schema.select.SurveySelectValue;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SurveySelectValueService {
    private final SurveyDataPointRepository surveyDataPointRepository;
    private final SurveySelectValueRepository surveySelectValueRepository;

    @Transactional
    public List<SurveySelectValue> createMultiple(String selectDPId, List<String> values){
        var optionalSelect = surveyDataPointRepository.findById(selectDPId);
        if (optionalSelect.isEmpty()) {
            throw new RuntimeException("Datapoint not found");
        }
        var select = optionalSelect.get();
        if (!(select instanceof SurveyDataPointSelect)) {
            throw new RuntimeException("Datapoint is not of select type");
        }
        var existingValues = surveySelectValueRepository.findExistingBySelectDataPointIdAndValues(selectDPId,values);

        // We do not add the existing values
        if(existingValues.size() == values.size()){
            throw  new RuntimeException("All values already present");
        }
        var newValues = values.stream().filter(v->!existingValues.contains(v)).toList();
        var selectValues = newValues.stream().map(v-> new SurveySelectValue(v, (SurveyDataPointSelect) select)).toList();
        surveySelectValueRepository.saveAll(selectValues);
        return selectValues;
    }

}
