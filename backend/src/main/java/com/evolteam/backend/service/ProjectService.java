package com.evolteam.backend.service;

import com.evolteam.backend.entity.Project;
import com.evolteam.backend.entity.Team;
import com.evolteam.backend.repository.ProjectRepository;
import com.evolteam.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TeamRepository teamRepository;

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get project by ID
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id " + id));
    }

    // Create new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Update existing project
    public Project updateProject(Long id, Project updatedProject) {
        Project project = getProjectById(id);
        project.setTitle(updatedProject.getTitle());
        project.setDescription(updatedProject.getDescription());
        project.setTeam(updatedProject.getTeam());
        return projectRepository.save(project);
    }

    // Delete project
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    // Get all projects for a specific team
    public List<Project> getProjectsByTeamId(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id " + teamId));
        return projectRepository.findByTeam(team);
    }
}
