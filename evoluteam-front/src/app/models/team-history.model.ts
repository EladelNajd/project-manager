export interface TeamHistory {
  id?: number;
  team?: { id: number } | null;
  teamName?: string | null;
  event: string;
  date?: string;  // Make date optional and string type
}
