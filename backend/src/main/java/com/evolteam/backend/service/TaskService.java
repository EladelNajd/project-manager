package com.evolteam.backend.service;

import com.evolteam.backend.entity.Task;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.entity.Project;
import com.evolteam.backend.repository.TaskRepository;
import com.evolteam.backend.repository.UserRepository;
import com.evolteam.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Get all tasks with eager loading of project and assignedUser
    public List<Task> getAllTasks() {
        return taskRepository.findAllWithProjectAndUser();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
    }

    public Task createTask(Task task) {
        System.out.println("Received task: " + task);
        System.out.println("Title: " + task.getTitle());
        System.out.println("Description: " + task.getDescription());
        System.out.println("Due Date: " + task.getDueDate());
        System.out.println("Status: " + task.getStatus());
        System.out.println("Assigned User ID: " + (task.getAssignedUser() != null ? task.getAssignedUser().getId() : "null"));
        System.out.println("Project ID: " + (task.getProject() != null ? task.getProject().getId() : "null"));

        if (task.getAssignedUser() != null && task.getAssignedUser().getId() != null) {
            User user = userRepository.findById(task.getAssignedUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + task.getAssignedUser().getId()));
            task.setAssignedUser(user);
        } else {
            task.setAssignedUser(null);
        }

        if (task.getProject() != null && task.getProject().getId() != null) {
            Project project = projectRepository.findById(task.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + task.getProject().getId()));
            task.setProject(project);
        } else {
            task.setProject(null);
        }

        Task savedTask = taskRepository.save(task);
        System.out.println("Task saved successfully with ID: " + savedTask.getId());
        return savedTask;
    }


    public Task updateTask(Long id, Task updatedTask) {
        System.out.println("UPDATE - Task ID: " + id);
        System.out.println("UPDATE - Received task: " + updatedTask);
        System.out.println("UPDATE - Title: " + updatedTask.getTitle());
        System.out.println("UPDATE - Description: " + updatedTask.getDescription());
        System.out.println("UPDATE - Due Date: " + updatedTask.getDueDate());
        System.out.println("UPDATE - Status: " + updatedTask.getStatus());
        System.out.println("UPDATE - Assigned User ID: " + (updatedTask.getAssignedUser() != null ? updatedTask.getAssignedUser().getId() : "null"));
        System.out.println("UPDATE - Project ID: " + (updatedTask.getProject() != null ? updatedTask.getProject().getId() : "null"));

        Task existingTask = getTaskById(id);
        System.out.println("UPDATE - Found existing task: " + existingTask.getTitle());

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setCompleted(updatedTask.isCompleted());

        if (updatedTask.getAssignedUser() != null && updatedTask.getAssignedUser().getId() != null) {
            User user = userRepository.findById(updatedTask.getAssignedUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + updatedTask.getAssignedUser().getId()));
            existingTask.setAssignedUser(user);
            System.out.println("UPDATE - Set assigned user: " + user.getName());
        } else {
            existingTask.setAssignedUser(null);
            System.out.println("UPDATE - Set assigned user to null");
        }

        if (updatedTask.getProject() != null && updatedTask.getProject().getId() != null) {
            Project project = projectRepository.findById(updatedTask.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + updatedTask.getProject().getId()));
            existingTask.setProject(project);
            System.out.println("UPDATE - Set project: " + project.getTitle());
        } else {
            existingTask.setProject(null);
            System.out.println("UPDATE - Set project to null");
        }

        Task savedTask = taskRepository.save(existingTask);
        System.out.println("UPDATE - Task updated successfully with ID: " + savedTask.getId());
        return savedTask;
    }


    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    // Use eager fetch versions here as well
    public List<Task> getTasksByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));
        return taskRepository.findByProject(project);
    }

    public List<Task> getTasksByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return taskRepository.findByAssignedUser(user);
    }
}
