package com.evolteam.backend.repository;

import com.evolteam.backend.entity.Project;
import com.evolteam.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTeam(Team team);
}
