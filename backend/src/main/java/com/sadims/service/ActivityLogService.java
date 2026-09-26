package com.sadims.service;

import com.sadims.entity.ActivityLog;
import com.sadims.entity.User;
import com.sadims.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository logRepository;

    public void logAction(User user, String action) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setActionType(action);
        logRepository.save(log);
    }
}
