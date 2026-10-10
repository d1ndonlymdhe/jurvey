package com.mdhe.jurvey.survey.repository;

import com.mdhe.jurvey.survey.schema.SurveySchema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface SurveyRepository extends JpaRepository<SurveySchema,String> {
    Optional<SurveySchema> findFirstByName(String name);
}
