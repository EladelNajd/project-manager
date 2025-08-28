package com.evolteam.backend.service;

import com.evolteam.backend.entity.*;
import com.evolteam.backend.repository.PointHistoryRepository;
import com.evolteam.backend.repository.SkillRepository;
import com.evolteam.backend.repository.SkillUpdateRequestRepository;
import com.evolteam.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SkillUpdateRequestService {

    @Autowired
    private SkillUpdateRequestRepository requestRepository;

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;
    public List<SkillUpdateRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public SkillUpdateRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    @Transactional
    public SkillUpdateRequest create(SkillUpdateRequest request) {
        return requestRepository.save(request);
    }

    @Transactional
    public SkillUpdateRequest update(Long id, SkillUpdateRequest updated) {
        SkillUpdateRequest existing = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        existing.setStatus(updated.getStatus());
        existing.setReviewedBy(updated.getReviewedBy());
        existing.setPointsAwarded(updated.getPointsAwarded());

        // Reattach user and skill if detached
        User user = updated.getUser();
        Skill skill = updated.getSkill();

        if (user != null && user.getId() != null) {
            user = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        if (skill != null && skill.getId() != null) {
            skill = skillRepository.findById(skill.getId())
                    .orElseThrow(() -> new RuntimeException("Skill not found"));
        }

        existing.setUser(user);
        existing.setSkill(skill);

        // If status is APPROVED, manage point history
        if (existing.getStatus() == RequestStatus.APPROVED) {
            final String skillName = skill.getName();
            final String reason = "Skill approved: " + skillName;

            PointHistory existingHistory = pointHistoryRepository.findByUser(user).stream()
                    .filter(ph -> reason.equals(ph.getReason()))
                    .findFirst()
                    .orElse(null);

            if (existingHistory == null) {
                // No existing entry → create
                PointHistory history = new PointHistory();
                history.setUser(user);
                history.setPoints(updated.getPointsAwarded());
                history.setReason(reason);
                history.setDate(LocalDateTime.now());
                history.setGivenBy(updated.getReviewedBy());

                pointHistoryRepository.save(history);
            } else {
                // Entry exists → update points if changed
                if (existingHistory.getPoints() != updated.getPointsAwarded()) {
                    existingHistory.setPoints(updated.getPointsAwarded());
                    existingHistory.setDate(LocalDateTime.now());
                    pointHistoryRepository.save(existingHistory);
                }
            }

            // No need to update user points manually — they are dynamically calculated
        }

        return requestRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        SkillUpdateRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == RequestStatus.APPROVED) {
            throw new RuntimeException("Cannot delete an approved request");
        }

        requestRepository.deleteById(id);
    }
}