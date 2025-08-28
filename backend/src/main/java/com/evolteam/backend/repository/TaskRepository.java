package com.evolteam.backend.repository;

import com.evolteam.backend.entity.Project;
import com.evolteam.backend.entity.Task;
import com.evolteam.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Eagerly fetch project and assignedUser to avoid nulls in JSON
    @EntityGraph(attributePaths = {"project", "assignedUser"})
    @Query("SELECT t FROM Task t")
    List<Task> findAllWithProjectAndUser();

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByProject(Project project);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByAssignedUser(User user);
}
