// ✅ user.model.ts (shared)
export interface User {
  id: number;
  name: string;
  email: string;
  profileInfo: string;
  role: string;
  password?: string;
  points?: number;
  teamId?: number;
  team?: {
    id: number;
    name?: string;
  };
}
