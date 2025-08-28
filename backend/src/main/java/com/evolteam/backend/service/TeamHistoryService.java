package com.evolteam.backend.service;

import com.evolteam.backend.entity.Team;
import com.evolteam.backend.entity.TeamHistory;
import com.evolteam.backend.repository.TeamHistoryRepository;
import com.evolteam.backend.repository.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TeamHistoryService {

    @Autowired
    private TeamHistoryRepository teamHistoryRepository;

    @Autowired
    private TeamRepository teamRepository;

    public List<TeamHistory> getAllHistories() {
        return teamHistoryRepository.findAll();
    }

    public List<TeamHistory> getHistoryByTeamId(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id " + teamId));
        return teamHistoryRepository.findByTeam(team);
    }

    public TeamHistory createHistory(TeamHistory history) {
        if (history.getTeam() != null) {
            Team fullTeam = teamRepository.findById(history.getTeam().getId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            history.setTeam(fullTeam);
            history.setTeamName(fullTeam.getName()); // ✅ Force fill
        }
        history.setDate(LocalDateTime.now());
        return teamHistoryRepository.save(history);
    }

    public void deleteHistory(Long id) {
        teamHistoryRepository.deleteById(id);
    }
}


