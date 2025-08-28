package com.evolteam.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 500)
    private String description;

    @OneToOne
    @JoinColumn(name = "lead_id", nullable = true)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User lead;

    @OneToMany(mappedBy = "team") // ✅ Keep default (no cascade) to preserve users
    @JsonIgnoreProperties("team")
    private List<User> users;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true) // ✅ Projects are deleted with team
    @JsonIgnoreProperties("team")
    private List<Project> projects;

    @OneToMany(mappedBy = "team") // ✅ Removed cascade = ALL to prevent deleting history
    @JsonIgnoreProperties("team")
    private List<TeamHistory> history;
}
