import { JobApplication } from "../types";

const STORAGE_KEY = "jobApplications";

export function loadApplications(): JobApplication[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplications(apps: JobApplication[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}
