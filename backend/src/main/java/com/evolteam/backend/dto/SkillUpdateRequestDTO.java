package com.evolteam.backend.dto;

public class SkillUpdateRequestDTO {
    private Long id;
    private String status;
    private int pointsAwarded;
    private String userName;
    private String skillName;

    public SkillUpdateRequestDTO() {}

    public SkillUpdateRequestDTO(Long id, String status, int pointsAwarded, String userName, String skillName) {
        this.id = id;
        this.status = status;
        this.pointsAwarded = pointsAwarded;
        this.userName = userName;
        this.skillName = skillName;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(int pointsAwarded) { this.pointsAwarded = pointsAwarded; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
}
