package com.sadims.service;

import com.sadims.entity.Farm;
import com.sadims.entity.User;
import com.sadims.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Farm addFarm(Farm farm, User user) {
        farm.setUser(user); // Link farm to the creator
        Farm savedFarm = farmRepository.save(farm);
        activityLogService.logAction(user, "ADD_FARM: " + farm.getLocation());
        return savedFarm;
    }

    public List<Farm> getFarmsByUser(User user) {
        // Farmer View: See only own farms
        return farmRepository.findByUser_Id(user.getId());
    }

    public List<Farm> getAllFarms() {
        // Admin View: See ALL farms
        return farmRepository.findAll();
    }
}
