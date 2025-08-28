package com.evolteam.backend.service;

import com.evolteam.backend.entity.*;
import com.evolteam.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("securityService") // Required for @PreAuthorize SpEL usage
public class SecurityService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private SkillUpdateRequestRepository skillUpdateRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    public boolean isUserInTeam(Long teamId, Long userId) {
        return teamRepository.findById(teamId)
                .map(team -> team.getUsers().stream()
                        .anyMatch(user -> user.getId().equals(userId)))
                .orElse(false);
    }

    public boolean isUserTeamLead(Long teamId, Long userId) {
        return teamRepository.findById(teamId)
                .map(team -> team.getLead() != null &&
                        team.getLead().getId().equals(userId))
                .orElse(false);
    }

    public boolean isUserPartOfProject(Long projectId, Long userId) {
        return projectRepository.findById(projectId)
                .map(project -> project.getTeam() != null &&
                        isUserInTeam(project.getTeam().getId(), userId))
                .orElse(false);
    }

    public boolean isRequestOwner(Long requestId, String username) {
        Optional<SkillUpdateRequest> request = skillUpdateRequestRepository.findById(requestId);
        Optional<User> user = userRepository.findByEmail(username);

        return request.isPresent() && user.isPresent() &&
                request.get().getUser() != null &&
                request.get().getUser().getId().equals(user.get().getId());
    }

    public boolean isRequestOwnerById(Long requestId, Long userId) {
        return skillUpdateRequestRepository.findById(requestId)
                .map(request -> request.getUser() != null && request.getUser().getId().equals(userId))
                .orElse(false);
    }

    public boolean isSameUser(Long userId, Long principalId) {
        return userId != null && userId.equals(principalId);
    }

    public boolean hasRole(Long userId, String roleName) {
        return userRepository.findById(userId)
                .map(user -> user.getRole().name().equalsIgnoreCase(roleName))
                .orElse(false);
    }

    public boolean hasAnyRole(Long userId, List<String> roles) {
        return userRepository.findById(userId)
                .map(user -> roles.contains(user.getRole().name().toUpperCase()))
                .orElse(false);
    }

    public boolean isReviewerOrAdmin(Long reviewId, Long principalId) {
        Optional<Review> review = reviewRepository.findById(reviewId);
        Optional<User> user = userRepository.findById(principalId);

        return review.isPresent() && user.isPresent() && (
                review.get().getReviewer() != null && review.get().getReviewer().getId().equals(principalId) ||
                        user.get().getRole().name().equalsIgnoreCase("ADMIN")
        );
    }

    public boolean isUserPartOfTask(Long taskId, Long userId) {
        return taskRepository.findById(taskId)
                .map(task -> task.getProject() != null &&
                        task.getProject().getTeam() != null &&
                        isUserInTeam(task.getProject().getTeam().getId(), userId))
                .orElse(false);
    }

    // PointHistory Specific Authorizations

    public boolean canViewPointHistory(Long targetUserId, Long principalId) {
        return targetUserId != null && (targetUserId.equals(principalId) || hasRole(principalId, "ADMIN"));
    }

    public boolean canCreatePointHistory(Long principalId) {
        return hasAnyRole(principalId, List.of("ADMIN", "TEAM_LEAD"));
    }

    public boolean canDeletePointHistory(Long historyId, Long principalId) {
        Optional<PointHistory> history = pointHistoryRepository.findById(historyId);
        Optional<User> user = userRepository.findById(principalId);

        return history.isPresent() && user.isPresent() && (
                history.get().getGivenBy() != null && history.get().getGivenBy().getId().equals(principalId) ||
                        user.get().getRole().name().equalsIgnoreCase("ADMIN")
        );
    }
}
