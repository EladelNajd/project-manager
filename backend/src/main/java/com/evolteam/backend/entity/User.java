package com.evolteam.backend.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // ❌ REMOVE this line if you want full consistency and dynamic calculation
    // private int points;

    private String profileInfo;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties({"users", "projects", "history", "lead"})
    private Team team;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SkillUpdateRequest> skillUpdateRequests;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviewsGiven;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PointHistory> pointHistories;

    @OneToMany(mappedBy = "givenBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PointHistory> pointsGiven;

    @PreRemove
    private void preRemove() {
        if ((reviews != null && !reviews.isEmpty()) ||
                (skillUpdateRequests != null && !skillUpdateRequests.isEmpty()) ||
                (pointHistories != null && !pointHistories.isEmpty())) {
            throw new RuntimeException("Cannot delete user with linked data (reviews, requests, or points).");
        }
    }

    // ✅ Dynamically calculated points
    @Transient
    public int getPoints() {
        return pointHistories != null
                ? pointHistories.stream().mapToInt(PointHistory::getPoints).sum()
                : 0;
    }

}
