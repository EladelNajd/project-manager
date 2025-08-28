export interface Project {
  id?: number;
  name: string;
  title: string;
  description: string;
  team?: {
    id: number;
    name?: string;
  };
}
