package com.sadims.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_disease_records")
public class CropDiseaseRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    @JsonIgnore
    private Farm farm;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "predicted_disease")
    private String predictedDisease;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    private String recommendation;

    @Column(length = 500)
    private String cause;

    @Column(name = "organic_solutions", columnDefinition = "TEXT")
    private String organicSolutions; // Stored as JSON array

    @Column(name = "chemical_solutions", columnDefinition = "TEXT")
    private String chemicalSolutions; // Stored as JSON array

    @Column(name = "prevention_tips", columnDefinition = "TEXT")
    private String preventionTips; // Stored as JSON array

    @Column(name = "prediction_date")
    private LocalDateTime predictionDate;

    @PrePersist
    protected void onCreate() {
        predictionDate = LocalDateTime.now();
    }

    // Helper for Frontend
    @JsonProperty("farmId")
    public Long getFarmId() {
        return farm != null ? farm.getId() : null;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getPredictedDisease() {
        return predictedDisease;
    }

    public void setPredictedDisease(String predictedDisease) {
        this.predictedDisease = predictedDisease;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public String getOrganicSolutions() {
        return organicSolutions;
    }

    public void setOrganicSolutions(String organicSolutions) {
        this.organicSolutions = organicSolutions;
    }

    public String getChemicalSolutions() {
        return chemicalSolutions;
    }

    public void setChemicalSolutions(String chemicalSolutions) {
        this.chemicalSolutions = chemicalSolutions;
    }

    public String getPreventionTips() {
        return preventionTips;
    }

    public void setPreventionTips(String preventionTips) {
        this.preventionTips = preventionTips;
    }
}
