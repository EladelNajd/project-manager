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
public class PointHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User user;

    private int points;

    private String reason;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "given_by", nullable = false)
    @JsonIgnoreProperties({"team", "skillUpdateRequests", "reviews", "pointHistories", "reviewsGiven"})
    private User givenBy;
}
