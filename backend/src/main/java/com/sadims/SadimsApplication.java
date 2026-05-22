package com.sadims;

import com.sadims.entity.User;
import com.sadims.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class SadimsApplication {

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(SadimsApplication.class, args);
		System.out.println("SADIMS Backend is Running on Port 8080...");
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository) {
		return args -> {
			String adminMobile = "7425915809";
			Optional<User> adminOpt = userRepository.findByMobileNumber(adminMobile);

			if (adminOpt.isEmpty()) {
				System.out.println("Seeding default admin account...");
				User admin = new User();
				admin.setName("Khushveer Dara");
				admin.setMobileNumber(adminMobile);
				admin.setPassword("admin123");
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Admin account created successfully!");
			}
		};
	}

}
