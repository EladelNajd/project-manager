package com.evolteam.backend.repository;

import com.evolteam.backend.entity.PointHistory;
import com.evolteam.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {

    List<PointHistory> findByUser(User user);

    // ✅ Used to check for existing entries (optional if you prefer by ID)
    List<PointHistory> findByUserId(Long userId);

    // ✅ Used to recalculate total points for a user
    @Query("SELECT COALESCE(SUM(p.points), 0) FROM PointHistory p WHERE p.user.id = :userId")
    int sumPointsByUserId(@Param("userId") Long userId);
}
