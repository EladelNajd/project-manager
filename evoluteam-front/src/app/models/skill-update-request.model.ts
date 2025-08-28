import { User } from './user.model';
import { Skill } from './skill.model';

export interface SkillUpdateRequest {
  id?: number;
  user: User;
  skill: Skill;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  pointsAwarded: number;
  reason?: string;
  reviewedBy?: User | null;
}
