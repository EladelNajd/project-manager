import { User } from './user.model';

export interface Review {
  id?: number;
  content: string;
  date: Date;
  user: User;       // Reviewee
  reviewer: User;   // Reviewer
}
