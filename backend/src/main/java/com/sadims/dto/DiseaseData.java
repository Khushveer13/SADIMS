package com.sadims.dto;

import java.util.List;

public class DiseaseData {
    private String diseaseName;
    private String cause;
    private String recommendation;
    private List<OrganicSolution> organicSolutions;
    private List<ChemicalSolution> chemicalSolutions;
    private List<String> preventionTips;
    private String riskLevel;

    public DiseaseData() {
    }

    public DiseaseData(String diseaseName, String cause, String recommendation,
            List<OrganicSolution> organicSolutions,
            List<ChemicalSolution> chemicalSolutions,
            List<String> preventionTips,
            String riskLevel) {
        this.diseaseName = diseaseName;
        this.cause = cause;
        this.recommendation = recommendation;
        this.organicSolutions = organicSolutions;
        this.chemicalSolutions = chemicalSolutions;
        this.preventionTips = preventionTips;
        this.riskLevel = riskLevel;
    }

    // Getters and Setters
    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<OrganicSolution> getOrganicSolutions() {
        return organicSolutions;
    }

    public void setOrganicSolutions(List<OrganicSolution> organicSolutions) {
        this.organicSolutions = organicSolutions;
    }

    public List<ChemicalSolution> getChemicalSolutions() {
        return chemicalSolutions;
    }

    public void setChemicalSolutions(List<ChemicalSolution> chemicalSolutions) {
        this.chemicalSolutions = chemicalSolutions;
    }

    public List<String> getPreventionTips() {
        return preventionTips;
    }

    public void setPreventionTips(List<String> preventionTips) {
        this.preventionTips = preventionTips;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
