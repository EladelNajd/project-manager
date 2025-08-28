export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completed: boolean;
  assignedUser?: {
    id: number;
    name: string;
  } | null;
  project?: {
    id: number;
    title: string;
  } | null;
}