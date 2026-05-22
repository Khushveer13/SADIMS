package com.sadims.repository;

import com.sadims.entity.WeatherRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {
    List<WeatherRecord> findByFarm_Id(Long farmId);

    void deleteByFarm_Id(Long farmId);
}
