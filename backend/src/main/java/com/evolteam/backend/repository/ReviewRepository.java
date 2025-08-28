package com.evolteam.backend.repository;

import com.evolteam.backend.entity.Review;
import com.evolteam.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUser(User user);
}
