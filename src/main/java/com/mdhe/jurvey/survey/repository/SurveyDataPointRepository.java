package com.mdhe.jurvey.survey.repository;

import com.mdhe.jurvey.survey.repository.types.NumQuestionView;
import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SurveyDataPointRepository extends JpaRepository<SurveyDataPoint,String> {
    @Query("""
    select sdp.survey.id as surveyId, count(sdp) as questionCount
    from SurveyDataPoint sdp
    where sdp.survey.id in :ids
    group by sdp.survey.id
""")
    List<NumQuestionView> countBySurveyIds(@Param("ids") List<String> ids);

    List<SurveyDataPoint> findByLabelIn(Collection<@NotNull String> label);
    List<SurveyDataPoint> findByIdInAndSurveyId(Collection<@NotNull String> id, String SurveyId);
    boolean existsBySurveyIdAndLabel(String surveyId, String label);
}
