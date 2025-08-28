package com.evolteam.backend.service;

import com.evolteam.backend.entity.PointHistory;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.repository.PointHistoryRepository;
import com.evolteam.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PointHistoryService {

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all point histories
    public List<PointHistory> getAllHistories() {
        return pointHistoryRepository.findAll();
    }

    // ✅ Get history for a specific user
    public List<PointHistory> getHistoryByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        return pointHistoryRepository.findByUser(user);
    }

    // ✅ Create a new point history entry
    public PointHistory createHistory(PointHistory history) {
        history.setDate(LocalDateTime.now());

        // Validate recipient user
        User user = history.getUser();
        if (user == null || user.getId() == null) {
            throw new RuntimeException("User must be set and exist for PointHistory.");
        }
        userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id " + user.getId()));

        // Get the currently logged-in user from Spring Security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInUsername = authentication.getName(); // This should be your principal's username or email

        // Find logged-in user entity
        User givenByUser = userRepository.findByEmail(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        // Set givenBy user automatically
        history.setGivenBy(givenByUser);

        // Save and return the PointHistory entity
        return pointHistoryRepository.save(history);
    }

    // ✅ Delete point history entry
    public void deleteHistory(Long id) {
        PointHistory history = pointHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Point history not found with id " + id));

        pointHistoryRepository.deleteById(id);
    }
}
