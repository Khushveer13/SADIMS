package com.sadims.dto;

public class OrganicSolution {
    private String name;
    private String dosage;
    private String frequency;
    private String note;

    public OrganicSolution() {
    }

    public OrganicSolution(String name, String dosage, String frequency, String note) {
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.note = note;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
