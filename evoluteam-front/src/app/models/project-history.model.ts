// src/app/projectmanager/project-history/project-history.model.ts
export interface ProjectHistory {
  id?: number;
  event: string;
  date: string;  // ISO string date
  project: {
    id: number; // Only project id is required here
  };
}
