package com.sadims.controller;

import com.sadims.entity.WeatherRecord;
import com.sadims.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @PostMapping
    public ResponseEntity<WeatherRecord> addWeather(@RequestBody WeatherRecord weather, @RequestParam Long farmId) {
        return ResponseEntity.ok(weatherService.addWeatherLog(farmId, weather));
    }

    @GetMapping("/{farmId}")
    public ResponseEntity<List<WeatherRecord>> getWeather(@PathVariable Long farmId) {
        return ResponseEntity.ok(weatherService.getWeatherForFarm(farmId));
    }

    @DeleteMapping("/{farmId}")
    public ResponseEntity<Void> deleteWeather(@PathVariable Long farmId) {
        weatherService.deleteHistory(farmId);
        return ResponseEntity.ok().build();
    }
}
