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
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User reviewer;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime date;
}