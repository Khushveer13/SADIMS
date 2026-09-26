package com.sadims.repository;

import com.sadims.entity.CropDiseaseRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CropDiseaseRecordRepository extends JpaRepository<CropDiseaseRecord, Long> {
    List<CropDiseaseRecord> findByFarm_Id(Long farmId);

    List<CropDiseaseRecord> findByFarm_UserId(Long userId); // Finds all records for a specific farmer

    void deleteByFarm_Id(Long farmId);
}
