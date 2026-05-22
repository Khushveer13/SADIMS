package com.sadims.service;

import com.sadims.entity.Farm;
import com.sadims.entity.WeatherRecord;
import com.sadims.repository.FarmRepository;
import com.sadims.repository.WeatherRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class WeatherService {

    @Autowired
    private WeatherRecordRepository weatherRepository;

    @Autowired
    private FarmRepository farmRepository;

    public WeatherRecord addWeatherLog(long farmId, WeatherRecord weather) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        weather.setFarm(farm);
        return weatherRepository.save(weather);
    }

    public List<WeatherRecord> getWeatherForFarm(Long farmId) {
        return weatherRepository.findByFarm_Id(farmId);
    }

    public List<WeatherRecord> getAllWeather() {
        return weatherRepository.findAll();
    }

    @Transactional
    public void deleteHistory(Long farmId) {
        weatherRepository.deleteByFarm_Id(farmId);
    }
}
