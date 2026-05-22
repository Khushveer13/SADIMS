package com.sadims.controller;

import com.sadims.entity.CropDiseaseRecord;
import com.sadims.entity.Farm;
import com.sadims.entity.WeatherRecord;
import com.sadims.service.DiseaseService;
import com.sadims.service.FarmService;
import com.sadims.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private FarmService farmService;

    @Autowired
    private DiseaseService diseaseService;

    @Autowired
    private WeatherService weatherService;

    // Secure checking would happen here in a real app (Token validation)

    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    @GetMapping("/diseases")
    public ResponseEntity<List<CropDiseaseRecord>> getAllDiseases() {
        return ResponseEntity.ok(diseaseService.getAllHistory());
    }

    @GetMapping("/weather")
    public ResponseEntity<List<WeatherRecord>> getAllWeather() {
        return ResponseEntity.ok(weatherService.getAllWeather());
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Integer>> getDashboardStats() {
        // Simple aggregation
        int totalFarms = farmService.getAllFarms().size();
        int totalScans = diseaseService.getAllHistory().size();
        int totalWeatherLogs = weatherService.getAllWeather().size();

        return ResponseEntity.ok(Map.of(
                "totalFarms", totalFarms,
                "totalScans", totalScans,
                "totalWeatherLogs", totalWeatherLogs));
    }
}
