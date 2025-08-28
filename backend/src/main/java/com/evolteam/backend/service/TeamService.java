package com.evolteam.backend.service;

import com.evolteam.backend.entity.Role;
import com.evolteam.backend.entity.Team;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.repository.TeamRepository;
import com.evolteam.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id " + id));
    }

    public Team createTeam(Team team) {
        // Validate and attach lead and users
        attachLeadAndUsers(team);

        // Save the team
        Team savedTeam = teamRepository.save(team);

        // Set team reference on users
        for (User  user : savedTeam.getUsers()) {
            user.setTeam(savedTeam);
            userRepository.save(user);
        }

        return savedTeam;
    }

    public Team updateTeam(Long id, Team updatedTeam) {
        Team existingTeam = getTeamById(id);

        // Authorization checks
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser  = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // Admins can always update, TEAM_LEAD only their team
        if (currentUser .getRole() != Role.ADMIN) {
            if (currentUser .getRole() == Role.TEAM_LEAD &&
                    (existingTeam.getLead() == null || !existingTeam.getLead().getId().equals(currentUser .getId()))) {
                throw new RuntimeException("You are not the lead of this team.");
            }

            if (currentUser .getRole() != Role.TEAM_LEAD) {
                throw new RuntimeException("You are not authorized to update this team.");
            }
        }

        // Validate and update team lead (optional)
        if (updatedTeam.getLead() != null && updatedTeam.getLead().getId() != null) {
            User newLead = userRepository.findById(updatedTeam.getLead().getId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));

            if (newLead.getRole() != Role.TEAM_LEAD) {
                throw new RuntimeException("User  with id " + newLead.getId() + " is not a TEAM_LEAD.");
            }

            Optional<Team> existingLeadTeam = teamRepository.findByLeadId(newLead.getId());
            if (existingLeadTeam.isPresent() && !existingLeadTeam.get().getId().equals(id)) {
                throw new RuntimeException("User  already leads another team.");
            }

            existingTeam.setLead(newLead);
        } else {
            existingTeam.setLead(null);
        }

        // Update fields
        existingTeam.setName(updatedTeam.getName());
        existingTeam.setDescription(updatedTeam.getDescription());

        return teamRepository.save(existingTeam);
    }

    @Transactional
    public void deleteTeam(Long id) {
        Team team = getTeamById(id);

        // Detach users
        for (User  user : team.getUsers()) {
            user.setTeam(null);
            userRepository.save(user);
        }

        // Detach lead
        if (team.getLead() != null) {
            team.setLead(null);
        }

        teamRepository.save(team); // Persist lead change before deletion
        teamRepository.delete(team);
    }

    public List<User> getUsersByTeamId(Long teamId) {
        Team team = getTeamById(teamId);
        return team.getUsers();
    }

    private void attachLeadAndUsers(Team team) {
        // Validate and attach lead
        if (team.getLead() != null && team.getLead().getId() != null) {
            User lead = userRepository.findById(team.getLead().getId())
                    .orElseThrow(() -> new RuntimeException("Lead not found with id: " + team.getLead().getId()));

            if (lead.getRole() != Role.TEAM_LEAD) {
                throw new RuntimeException("User  with id " + lead.getId() + " is not a TEAM_LEAD.");
            }

            team.setLead(lead);
        }

        // Attach users
        if (team.getUsers() != null && !team.getUsers().isEmpty()) {
            List<User> attachedUsers = team.getUsers().stream()
                    .map(user -> userRepository.findById(user.getId())
                            .orElseThrow(() -> new RuntimeException("User  not found with id: " + user.getId())))
                    .toList();
            team.setUsers(attachedUsers);
        }
    }
}
