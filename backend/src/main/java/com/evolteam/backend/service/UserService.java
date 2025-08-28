// ✅ FIXED UserService.java
package com.evolteam.backend.service;

import com.evolteam.backend.entity.Role;
import com.evolteam.backend.entity.Team;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.repository.TeamRepository;
import com.evolteam.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public User createUser(User user) {
        String rawPassword = user.getPassword();

        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password must not be empty.");
        }

        user.setPassword(passwordEncoder.encode(rawPassword));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setProfileInfo(updatedUser.getProfileInfo());

        Team newTeam = updatedUser.getTeam();
        if (newTeam != null && newTeam.getId() != null) {
            Team fetchedTeam = teamRepository.findById(newTeam.getId())
                    .orElseThrow(() -> new RuntimeException("Team not found with id: " + newTeam.getId()));
            existingUser.setTeam(fetchedTeam);

            if (!fetchedTeam.getUsers().contains(existingUser)) {
                fetchedTeam.getUsers().add(existingUser);
                teamRepository.save(fetchedTeam);
            }
        } else {
            existingUser.setTeam(null);
        }

        // ✅ REMOVED points update logic since points are now calculated dynamically
        // The frontend shouldn't be sending points, and if it does, we ignore it

        String newPassword = updatedUser.getPassword();
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(existingUser);
    }

    // Backend Service Method
    public void deleteUser(Long id) {
        User user = getUserById(id);

        // ✅ Enhanced validation for delete operation with clearer messages
        if (user.getReviews() != null && !user.getReviews().isEmpty()) {
            throw new IllegalStateException("Cannot delete user with linked reviews. Please remove or reassign reviews first.");
        }

        if (user.getSkillUpdateRequests() != null && !user.getSkillUpdateRequests().isEmpty()) {
            throw new IllegalStateException("Cannot delete user with linked skill update requests. Please resolve pending requests first.");
        }

        if (user.getPointHistories() != null && !user.getPointHistories().isEmpty()) {
            throw new IllegalStateException("Cannot delete user with linked point history. User has earned points that cannot be removed.");
        }

        // If the user is a team lead, remove them from the team
        teamRepository.findByLeadId(user.getId()).ifPresent(team -> {
            team.setLead(null);
            teamRepository.save(team);
        });

        userRepository.delete(user);
    }

    public List<User> getUsersByTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id " + teamId));
        return userRepository.findByTeam(team);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}