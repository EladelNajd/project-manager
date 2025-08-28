package com.evolteam.backend.service;

import com.evolteam.backend.entity.Skill;
import com.evolteam.backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id " + id));
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {
        Skill existing = getSkillById(id);
        existing.setName(updatedSkill.getName());
        return skillRepository.save(existing);
    }

    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);

        // ❗ Prevent deleting skill if it has requests
        if (skill.getSkillUpdateRequests() != null && !skill.getSkillUpdateRequests().isEmpty()) {
            throw new RuntimeException("Cannot delete skill: it is referenced in skill update requests.");
        }

        skillRepository.delete(skill);
    }
}
