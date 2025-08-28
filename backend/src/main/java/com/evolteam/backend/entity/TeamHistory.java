package com.evolteam.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class TeamHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Nullable = true to allow team deletion without losing history
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = true)
    @JsonIgnoreProperties({"users", "projects", "history", "lead"})
    private Team team;

    // ✅ This snapshot is preserved even if the team is deleted
    private String teamName;

    private String event;

    private LocalDateTime date;

    @PrePersist
    public void prePersist() {
        if (team != null && teamName == null) {
            this.teamName = team.getName(); // Safe auto-fill
        }
        if (date == null) {
            this.date = LocalDateTime.now();
        }
    }
}
