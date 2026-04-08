import { useState, useCallback, useEffect } from "react";
import { JobApplication, Stage } from "../types";
import { loadApplications, saveApplications } from "../utils/storage";
import { loadFromGist, startBackupTimer, isConfigured } from "../utils/backup";

function generateId(): string {
  return crypto.randomUUID();
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>(loadApplications);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isConfigured()) {
      setReady(true);
      return;
    }
    loadFromGist().then((loaded) => {
      if (loaded) setApplications(loadApplications());
      setReady(true);
      startBackupTimer();
    });
  }, []);

  const persist = useCallback((apps: JobApplication[]) => {
    setApplications(apps);
    saveApplications(apps);
  }, []);

  const addApplication = useCallback(() => {
    const newApp: JobApplication = {
      id: generateId(),
      date: todayString(),
      company: "",
      title: "",
      link: "",
      estComp: "",
      stage: "Applied" as Stage,
      notes: "",
    };
    persist([...loadApplications(), newApp]);
  }, [persist]);

  const updateApplication = useCallback((id: string, field: keyof JobApplication, value: string) => {
    const apps = loadApplications().map((app) =>
      app.id === id ? { ...app, [field]: value } : app
    );
    persist(apps);
  }, [persist]);

  const deleteApplication = useCallback((id: string) => {
    persist(loadApplications().filter((app) => app.id !== id));
  }, [persist]);

  const refreshFromGist = useCallback(async () => {
    setReady(false);
    const loaded = await loadFromGist();
    if (loaded) setApplications(loadApplications());
    setReady(true);
    startBackupTimer();
  }, []);

  return { applications, addApplication, updateApplication, deleteApplication, refreshFromGist, ready };
}
