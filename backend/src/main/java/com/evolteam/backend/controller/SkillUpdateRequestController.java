package com.evolteam.backend.controller;

import com.evolteam.backend.entity.SkillUpdateRequest;
import com.evolteam.backend.service.SkillUpdateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import com.evolteam.backend.dto.SkillUpdateRequestDTO;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-requests")
public class SkillUpdateRequestController {

    @Autowired
    private SkillUpdateRequestService requestService;

    // ✅ ADMIN and TEAM_LEAD can view all requests
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public List<SkillUpdateRequest> getAll() {
        return requestService.getAllRequests();
    }

    // ✅ Only the owner of the request or ADMIN/LEAD can view a specific request
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isRequestOwner(#id, principal.username)")
    @GetMapping("/{id}")
    public SkillUpdateRequest getById(@PathVariable Long id) {
        return requestService.getById(id);
    }

    // ✅ Any authenticated user can create a skill update request
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public SkillUpdateRequest create(@RequestBody SkillUpdateRequest request) {
        // ⚠️ If you use PreAuthorize based on `request.requester.id`, you must write:
        // @PreAuthorize("#request.requester.id == principal.id")
        // but it's better to just set the requester on the backend from the principal to avoid tampering
        return requestService.create(request);
    }

    // ✅ ADMIN, TEAM_LEAD, or user from same team can update the request
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @securityService.isUserInTeam(#id, principal.id)")
    @PutMapping("/{id}")
    public SkillUpdateRequest update(@PathVariable Long id, @RequestBody SkillUpdateRequest request) {
        return requestService.update(id, request);
    }

    // ✅ Only ADMIN or TEAM_LEAD can delete
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        requestService.delete(id);
    }
    @GetMapping("/with-user")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public List<SkillUpdateRequestDTO> getAllWithUserNames() {
        return requestService.getAllRequests().stream().map(req ->
                new SkillUpdateRequestDTO(
                        req.getId(),
                        req.getStatus().toString(),
                        req.getPointsAwarded(),
                        req.getUser() != null ? req.getUser().getName() : "N/A",
                        req.getSkill() != null ? req.getSkill().getName() : "N/A"
                )
        ).collect(Collectors.toList());
    }
}
