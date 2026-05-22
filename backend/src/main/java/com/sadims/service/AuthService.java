package com.sadims.service;

import com.sadims.entity.User;
import com.sadims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    // Fixed Admin Accounts (for validation if needed, though they should be in DB)
    // 7425915809, 9696430452, 9257166796, 9619790317

    public User registerFarmer(User user) {
        // Enforce Farmer Role for all public registrations
        user.setRole("FARMER");

        // Basic check: Mobile number constraint
        if (userRepository.findByMobileNumber(user.getMobileNumber()).isPresent()) {
            throw new RuntimeException("Mobile number already registered.");
        }

        User savedUser = userRepository.save(user);
        activityLogService.logAction(savedUser, "REGISTER");
        return savedUser;
    }

    public User login(String mobileNumber, String password) {
        Optional<User> userOpt = userRepository.findByMobileNumber(mobileNumber);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real app, use BCrypt. Here simple string comparison for minor project.
            if (user.getPassword().equals(password)) {
                activityLogService.logAction(user, "LOGIN");
                return user;
            }
        }
        throw new RuntimeException("Invalid Credentials");
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Incorrect existing password.");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
        activityLogService.logAction(user, "PASSWORD_CHANGE");
    }
}
