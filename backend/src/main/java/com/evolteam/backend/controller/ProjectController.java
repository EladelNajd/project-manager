package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Project;
import com.evolteam.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // ADMIN and TEAM_LEAD can view all projects
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // Any authenticated user can view project by ID if part of its team
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserPartOfProject(#id, principal.id)")
    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    // Only ADMIN and TEAM_LEAD can create projects
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    // Only ADMIN and TEAM_LEAD can update projects
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    // Only ADMIN can delete projects
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    // Any authenticated user can view projects for their team
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserInTeam(#teamId, principal.id)")
    @GetMapping("/team/{teamId}")
    public List<Project> getProjectsByTeamId(@PathVariable Long teamId) {
        return projectService.getProjectsByTeamId(teamId);
    }
}
