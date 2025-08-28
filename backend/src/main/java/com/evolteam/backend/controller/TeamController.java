package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Team;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    // Accessible to all authenticated users
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD', 'USER')")
    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    // ADMIN, TEAM_LEAD, or users within the team
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserInTeam(#id, principal.id)")
    @GetMapping("/{id}")
    public Team getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    // Only ADMIN can create teams
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    // ADMIN and TEAM_LEAD can update their own teams
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEAM_LEAD') and @securityService.isUserTeamLead(#id, principal.id))")
    public Team updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return teamService.updateTeam(id, team);
    }

    // Only ADMIN can delete teams
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }

    // ADMIN, TEAM_LEAD or user in the team
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserInTeam(#id, principal.id)")
    @GetMapping("/{id}/users")
    public List<User> getUsersByTeamId(@PathVariable Long id) {
        return teamService.getUsersByTeamId(id);
    }
    @GetMapping("/debug")
    public String debugPrincipal() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var principal = auth.getPrincipal();
        return "Principal class: " + principal.getClass().getName() +
                ", toString: " + principal.toString();
    }
}
