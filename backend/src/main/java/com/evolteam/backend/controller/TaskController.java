package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Task;
import com.evolteam.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ✅ Only ADMIN or TEAM_LEAD can get all tasks
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // ✅ Any authenticated user can get a task, but only if they belong to its project
    @PreAuthorize("@securityService.isUserPartOfProject(#id, principal.id)")
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // ✅ TEAM_LEAD or ADMIN can create tasks
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // ✅ TEAM_LEAD or ADMIN can update tasks
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    // ✅ Only ADMIN can delete a task
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // ✅ Only project members can see tasks of a project
    @PreAuthorize("@securityService.isUserInTeam(#projectId, principal.id)")
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    // ✅ Only the user himself, TEAM_LEAD, or ADMIN can see tasks assigned to a user
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEAM_LEAD') or #userId == principal.id")
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskService.getTasksByUserId(userId);
    }
}
