export type Stage = "Applied" | "Interviewing" | "Rejected" | "Offer";

export const STAGES: Stage[] = ["Applied", "Interviewing", "Rejected", "Offer"];

export const stageColors: Record<Stage, string> = {
  Applied: "#3b82f6",
  Interviewing: "#f59e0b",
  Rejected: "#ef4444",
  Offer: "#22c55e",
};

export const stageBgColors: Record<Stage, string> = {
  Applied: "rgba(59, 130, 246, 0.08)",
  Interviewing: "rgba(245, 158, 11, 0.08)",
  Rejected: "rgba(239, 68, 68, 0.08)",
  Offer: "rgba(34, 197, 94, 0.08)",
};

export type SortField = "date" | "company" | "title" | "estComp" | "stage";
export type SortDir = "asc" | "desc";

export interface JobApplication {
  id: string;
  date: string;
  company: string;
  title: string;
  link: string;
  estComp: string;
  stage: Stage;
  notes: string;
}
