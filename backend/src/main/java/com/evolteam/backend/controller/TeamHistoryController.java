package com.evolteam.backend.controller;

import com.evolteam.backend.entity.TeamHistory;
import com.evolteam.backend.service.TeamHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-history")
public class TeamHistoryController {

    private final TeamHistoryService teamHistoryService;

    @Autowired
    public TeamHistoryController(TeamHistoryService teamHistoryService) {
        this.teamHistoryService = teamHistoryService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public ResponseEntity<List<TeamHistory>> getAllHistories() {
        return ResponseEntity.ok(teamHistoryService.getAllHistories());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserInTeam(#teamId, principal.id)")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamHistory>> getHistoryByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamHistoryService.getHistoryByTeamId(teamId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping
    public ResponseEntity<TeamHistory> createHistory(@RequestBody TeamHistory history) {
        TeamHistory created = teamHistoryService.createHistory(history);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        teamHistoryService.deleteHistory(id);
        return ResponseEntity.noContent().build();
    }
}
