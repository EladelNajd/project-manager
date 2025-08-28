package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Role;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Only ADMIN and TEAM_LEAD can list all users
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve users");
        }
    }

    // ADMIN and TEAM_LEAD can get any user; USER can only get their own
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or #id == principal.id")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // Only ADMIN can create users
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            System.out.println("Creating user: " + user);
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            System.err.println("Bad request: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create user");
        }
    }

    // ADMIN can update any user, TEAM_LEAD can only update themselves
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEAM_LEAD') and #id == principal.id)")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            System.out.println("Updating user " + id + " with: " + userDetails);
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(value = "/{id}", produces = "text/plain")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        }
    }

    // ADMIN and TEAM_LEAD can list users by team
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping("/team/{teamId}")
    public List<User> getUsersByTeam(@PathVariable Long teamId) {
        return userService.getUsersByTeam(teamId);
    }

    // ADMIN and TEAM_LEAD can get users by role
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        try {
            Role roleEnum = Role.valueOf(role.toUpperCase());
            return userService.getUsersByRole(roleEnum);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + role);
        }
    }

    // Get current user (accessible to all authenticated users)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        // This endpoint should be implemented to return the current authenticated user
        // For now, returning a placeholder response
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Current user endpoint not implemented");
    }

    // Get calculated points for a user
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or #id == principal.id")
    @GetMapping("/{id}/points")
    public ResponseEntity<Integer> getCalculatedPoints(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user.getPoints());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}