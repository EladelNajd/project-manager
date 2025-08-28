package com.evolteam.backend.controller;

import com.evolteam.backend.entity.Review;
import com.evolteam.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ✅ ADMIN can view all reviews
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // ✅ Anyone authenticated can view reviews for a user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewService.getReviewsForUser(userId);
    }

    // ✅ Authenticated users can create a review
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    // ✅ Only the reviewer or ADMIN can delete
    @PreAuthorize("@securityService.isReviewerOrAdmin(#id, principal.id)")
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}
