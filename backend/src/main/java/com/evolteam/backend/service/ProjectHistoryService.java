package com.evolteam.backend.service;

import com.evolteam.backend.entity.Project;
import com.evolteam.backend.entity.ProjectHistory;
import com.evolteam.backend.repository.ProjectHistoryRepository;
import com.evolteam.backend.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectHistoryService {

    @Autowired
    private ProjectHistoryRepository projectHistoryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Get all project history entries
    public List<ProjectHistory> getAllHistories() {
        return projectHistoryRepository.findAll();
    }

    // Get history for a specific project
    public List<ProjectHistory> getHistoryByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id " + projectId));
        return projectHistoryRepository.findByProject(project);
    }

    public ProjectHistory createHistory(ProjectHistory history) {
        // Fetch the full project entity using the ID sent by frontend
        Long projectId = history.getProject().getId();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        history.setProject(project);
        history.setDate(LocalDateTime.now()); // override whatever frontend sends
        return projectHistoryRepository.save(history);
    }


    // Delete project history entry by id
    public void deleteHistory(Long id) {
        projectHistoryRepository.deleteById(id);
    }
}
