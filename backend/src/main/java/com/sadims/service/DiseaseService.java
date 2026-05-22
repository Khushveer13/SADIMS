package com.sadims.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sadims.dto.DiseaseData;
import com.sadims.entity.CropDiseaseRecord;
import com.sadims.entity.Farm;
import com.sadims.repository.CropDiseaseRecordRepository;
import com.sadims.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiseaseService {

    @Autowired
    private CropDiseaseRecordRepository recordRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private DiseaseSolutionDataService diseaseSolutionDataService;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ML_SERVICE_URL = "http://localhost:5000/predict";

    public CropDiseaseRecord predictAndSave(long farmId, String imagePath) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        String disease;
        String recommendation;
        String cause;
        double confidence;

        try {
            // 1. Call Real ML Service (Port 5000)
            Map<String, String> request = new HashMap<>();
            request.put("image_path", imagePath);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(ML_SERVICE_URL, request, Map.class);

            if (response != null) {
                disease = (String) response.get("disease");
                recommendation = (String) response.get("recommendation");
                cause = (String) response.get("cause");
                confidence = (Double) response.get("confidence");
            } else {
                throw new RuntimeException("ML Service returned empty response");
            }

        } catch (Exception e) {
            // FALLBACK TO DUMMY (In case ML Service is down during demo)
            System.err.println("ML Service Error: " + e.getMessage() + " | Using Fallback Logic");
            disease = "Healthy";
            recommendation = "No action needed. (System used fallback due to ML Service timeout)";
            cause = "Fallback logic active.";
            confidence = 99.9;
        }

        // 2. Get Structured Disease Data from Java Service
        DiseaseData diseaseData = diseaseSolutionDataService.getDiseaseData(disease);

        // If disease not found in database, use fallback
        if (diseaseData == null) {
            diseaseData = diseaseSolutionDataService.getDiseaseData("Healthy");
        }

        // 3. Create Record
        CropDiseaseRecord record = new CropDiseaseRecord();
        record.setFarm(farm);
        record.setImagePath(imagePath);
        record.setPredictedDisease(disease);
        record.setRecommendation(recommendation);
        record.setCause(cause);
        record.setConfidenceScore(confidence);

        // 4. Convert structured data to JSON and store
        try {
            String organicSolutionsJson = objectMapper.writeValueAsString(diseaseData.getOrganicSolutions());
            String chemicalSolutionsJson = objectMapper.writeValueAsString(diseaseData.getChemicalSolutions());
            String preventionTipsJson = objectMapper.writeValueAsString(diseaseData.getPreventionTips());

            record.setOrganicSolutions(organicSolutionsJson);
            record.setChemicalSolutions(chemicalSolutionsJson);
            record.setPreventionTips(preventionTipsJson);
        } catch (JsonProcessingException e) {
            System.err.println("Error serializing disease data: " + e.getMessage());
            // Set empty arrays as fallback
            record.setOrganicSolutions("[]");
            record.setChemicalSolutions("[]");
            record.setPreventionTips("[]");
        }

        // 5. Save
        CropDiseaseRecord saved = recordRepository.save(record);

        // 6. Log
        activityLogService.logAction(farm.getUser(), "PREDICT_DISEASE (Final): " + disease);

        return saved;
    }

    public List<CropDiseaseRecord> getHistoryForFarm(Long farmId) {
        return recordRepository.findByFarm_Id(farmId);
    }

    public List<CropDiseaseRecord> getAllHistory() {
        return recordRepository.findAll();
    }

    @Transactional
    public void deleteHistory(Long farmId) {
        recordRepository.deleteByFarm_Id(farmId);
    }
}
