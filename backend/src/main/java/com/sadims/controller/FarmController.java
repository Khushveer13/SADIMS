package com.sadims.controller;

import com.sadims.entity.Farm;
import com.sadims.entity.User;
import com.sadims.service.FarmService;
import com.sadims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "*")
public class FarmController {

    @Autowired
    private FarmService farmService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addFarm(@RequestBody Farm farm, @RequestParam long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(farmService.addFarm(farm, user));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Farm>> getFarms(@PathVariable long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(farmService.getFarmsByUser(user));
    }
}
