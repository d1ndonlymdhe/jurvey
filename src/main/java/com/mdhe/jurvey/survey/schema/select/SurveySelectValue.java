package com.mdhe.jurvey.survey.schema.select;

import com.mdhe.jurvey.survey.schema.SurveyDataPoint;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(uniqueConstraints = @UniqueConstraint(
        name = "unique_selectValue_select_value",
        columnNames = {"value", "select_data_point_id"}
))
public class SurveySelectValue {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @NotNull
    private String id;

    @Getter
    @Setter
    @NotNull
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @Getter
    @Setter
    private SurveyDataPoint selectDataPoint;


    @CreatedDate()
    private LocalDateTime createdAt;

    @LastModifiedDate()
    private LocalDateTime updatedAt;

    public SurveySelectValue(String value, SurveyDataPointSelect select) {
        this.value = value;
        this.selectDataPoint = select;
        select.getAllowedValues().add(this);
    }
}
