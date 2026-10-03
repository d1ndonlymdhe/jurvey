package com.mdhe.jurvey;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestRoute {
    @GetMapping("/")
    public ResponseEntity<String> test(){
        return new ResponseEntity<>("TEST", HttpStatusCode.valueOf(200));
    }
}
