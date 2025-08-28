package com.evolteam.backend.repository;

import com.evolteam.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByLeadId(Long leadId);
}
