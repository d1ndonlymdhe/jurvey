package com.mdhe.jurvey.survey.repository;

import com.mdhe.jurvey.survey.schema.select.SurveySelectValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveySelectValueRepository extends JpaRepository<SurveySelectValue,String> {
    boolean existsBySelectDataPointIdAndValue(String selectDatapointId, String value);
    @Query("""
    select ssv.value
    from SurveySelectValue ssv
    where ssv.selectDataPoint.id = :selectDataPointid
    and ssv.value in :values
""")
    List<String> findExistingBySelectDataPointIdAndValues(@Param("selectDatapointId") String selectDatapointId, @Param("values") List<String> values);
}
