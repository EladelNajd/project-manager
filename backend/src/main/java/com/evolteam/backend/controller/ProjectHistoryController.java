package com.evolteam.backend.controller;

import com.evolteam.backend.entity.ProjectHistory;
import com.evolteam.backend.service.ProjectHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-history")
public class ProjectHistoryController {

    @Autowired
    private ProjectHistoryService projectHistoryService;

    // ADMIN and TEAM_LEAD can view all history
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public List<ProjectHistory> getAllHistories() {
        return projectHistoryService.getAllHistories();
    }

    // Only ADMIN, TEAM_LEAD, or user in project team can access project history
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserPartOfProject(#projectId, principal.id)")
    @GetMapping("/project/{projectId}")
    public List<ProjectHistory> getHistoryByProject(@PathVariable Long projectId) {
        return projectHistoryService.getHistoryByProjectId(projectId);
    }

    // Only TEAM_LEAD or ADMIN can create project history entries
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping
    public ProjectHistory createHistory(@RequestBody ProjectHistory history) {
        return projectHistoryService.createHistory(history);
    }

    // Only ADMIN can delete history
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteHistory(@PathVariable Long id) {
        projectHistoryService.deleteHistory(id);
    }
}
