package com.evolteam.backend.repository;

import com.evolteam.backend.entity.ProjectHistory;
import com.evolteam.backend.entity.Project;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectHistoryRepository extends JpaRepository<ProjectHistory, Long> {
    List<ProjectHistory> findByProject(Project project);
}
