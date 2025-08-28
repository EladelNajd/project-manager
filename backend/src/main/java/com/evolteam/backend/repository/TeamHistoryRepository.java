package com.evolteam.backend.repository;

import com.evolteam.backend.entity.TeamHistory;
import com.evolteam.backend.entity.Team;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamHistoryRepository extends JpaRepository<TeamHistory, Long> {
    List<TeamHistory> findByTeam(Team team);
}
