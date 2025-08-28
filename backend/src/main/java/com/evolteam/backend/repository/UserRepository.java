package com.evolteam.backend.repository;

import com.evolteam.backend.entity.Role;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);
    List<User> findByTeam(Team team);

    // For authentication
    Optional<User> findByEmail(String email);
}
