package com.evolteam.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // ✅ New

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate; // ✅ New

    private String status; // ✅ New (e.g., PENDING, IN_PROGRESS, DONE)

    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = true)
    @JsonIgnoreProperties({"team", "tasks", "history"})
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id", nullable = true)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User assignedUser;
}
