package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Skill;
import com.evolteam.backend.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    // ✅ Anyone authenticated can view skills
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    // ✅ Anyone authenticated can view a skill
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    // ✅ Only ADMIN or TEAM_LEAD can create a skill
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }

    // ✅ Only ADMIN or TEAM_LEAD can update
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        return skillService.updateSkill(id, skill);
    }

    // ✅ Only ADMIN can delete a skill
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
    }
}
