package com.evolteam.backend.controller;

import com.evolteam.backend.entity.PointHistory;
import com.evolteam.backend.service.PointHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointHistoryController {

    @Autowired
    private PointHistoryService pointHistoryService;

    // ✅ Only ADMIN can view all histories (optional)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<PointHistory> getAll() {
        return pointHistoryService.getAllHistories();
    }

    // ✅ Authenticated user can view their own history, or ADMIN can view any
    @PreAuthorize("@securityService.canViewPointHistory(#userId, principal.id)")
    @GetMapping("/user/{userId}")
    public List<PointHistory> getByUser(@PathVariable Long userId) {
        return pointHistoryService.getHistoryByUserId(userId);
    }

    // ✅ Only ADMIN or TEAM_LEAD can create entries
    @PreAuthorize("@securityService.canCreatePointHistory(principal.id)")
    @PostMapping
    public PointHistory create(@RequestBody PointHistory history) {
        return pointHistoryService.createHistory(history);
    }

    // ✅ Only ADMIN or the one who gave the points can delete
    @PreAuthorize("@securityService.canDeletePointHistory(#id, principal.id)")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        pointHistoryService.deleteHistory(id);
    }
}
