package com.sadims.controller;

import com.sadims.dto.DiseaseCheckRequest;
import com.sadims.entity.CropDiseaseRecord;
import com.sadims.service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disease")
@CrossOrigin(origins = "*")
public class DiseaseController {

    @Autowired
    private DiseaseService diseaseService;

    @PostMapping("/check")
    public ResponseEntity<CropDiseaseRecord> checkDisease(@RequestBody DiseaseCheckRequest request) {
        return ResponseEntity.ok(diseaseService.predictAndSave(request.getFarmId(), request.getImagePath()));
    }

    @GetMapping("/history/{farmId}")
    public ResponseEntity<List<CropDiseaseRecord>> getHistory(@PathVariable Long farmId) {
        return ResponseEntity.ok(diseaseService.getHistoryForFarm(farmId));
    }

    @DeleteMapping("/history/{farmId}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long farmId) {
        diseaseService.deleteHistory(farmId);
        return ResponseEntity.ok().build();
    }
}
