package com.statsinnotech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class StatsInnotechApplication {

    public static void main(String[] args) {
        SpringApplication.run(StatsInnotechApplication.class, args);
    }
}
