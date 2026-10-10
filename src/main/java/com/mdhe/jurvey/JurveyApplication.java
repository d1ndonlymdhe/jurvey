package com.mdhe.jurvey;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class JurveyApplication {

    public static void main(String[] args) {
        SpringApplication.run(JurveyApplication.class, args);
    }

}
