package com.mdhe.jurvey.survey.repository;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyDataPointRepository extends JpaRepository<SurveyDataPoint,String> { }
