package com.evolteam.backend.service;

import com.evolteam.backend.entity.Review;
import com.evolteam.backend.entity.User;
import com.evolteam.backend.repository.ReviewRepository;
import com.evolteam.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // ✅ Get reviews by user (reviewee)
    public List<Review> getReviewsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        return reviewRepository.findByUser(user);
    }

    // ✅ Create new review
    public Review createReview(Review review) {
        review.setDate(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // ✅ Delete review by ID
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
