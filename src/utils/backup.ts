const TOKEN_KEY = "jat_token";
const GIST_ID_KEY = "jat_gistId";
const BACKUP_INTERVAL_MS = 5 * 60 * 1000;
const STORAGE_KEY = "jat_applications";

let lastBackupData = "";
let backupTimer: number | null = null;
let statusCallback: ((msg: string, color: string) => void) | null = null;

function hasUnsavedChanges(): boolean {
  const data = localStorage.getItem(STORAGE_KEY) || "[]";
  return data !== lastBackupData && data !== "[]";
}

window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
  }
});

export function setStatusCallback(cb: (msg: string, color: string) => void): void {
  statusCallback = cb;
}

function updateStatus(msg: string, persist = false): void {
  const color = msg.startsWith("Failed")
    ? "#c0392b"
    : msg.includes("...")
      ? "#7f8c8d"
      : "#27ae60";
  statusCallback?.(msg, color);
  if (!persist) setTimeout(() => statusCallback?.("", ""), 4000);
}

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    if (backupTimer !== null) clearInterval(backupTimer);
  }
}

function getGistId(): string {
  return localStorage.getItem(GIST_ID_KEY) || "";
}

export function setGistId(id: string): void {
  if (id) {
    localStorage.setItem(GIST_ID_KEY, id);
  } else {
    localStorage.removeItem(GIST_ID_KEY);
  }
}

export function isConfigured(): boolean {
  return !!(getToken() && getGistId());
}

export interface GistMatch {
  id: string;
  description: string;
  updatedAt: string;
}

export async function findExistingGists(token: string): Promise<GistMatch[]> {
  const res = await fetch("https://api.github.com/gists?per_page=100", {
    headers: { Authorization: `token ${token}` },
  });
  if (res.status === 401) throw new Error("Invalid token. Check that it has the gist scope.");
  if (res.status === 403) throw new Error("Token lacks permissions. Ensure the gist scope is enabled.");
  if (!res.ok) throw new Error(`Failed to fetch gists: ${res.status}`);
  const gists = await res.json();
  return gists
    .filter((g: { description: string; files: Record<string, unknown> }) =>
      g.description === "JobApplicationTracker" || g.files?.["job-applications.json"]
    )
    .map((g: { id: string; description: string; updated_at: string }) => ({
      id: g.id,
      description: g.description,
      updatedAt: g.updated_at,
    }));
}

export async function createNewGist(token: string): Promise<string> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: "JobApplicationTracker",
      public: false,
      files: { "job-applications.json": { content: "[]" } },
    }),
  });
  if (!res.ok) throw new Error(`Failed to create gist: ${res.status}`);
  const json = await res.json();
  return json.id;
}

async function fetchGist(): Promise<string | null> {
  const token = getToken();
  const gistId = getGistId();
  if (!token || !gistId) return null;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.files?.["job-applications.json"]?.content ?? null;
}

async function pushToGist(data: string): Promise<void> {
  const token = getToken();
  const gistId = getGistId();
  if (!token || !gistId) return;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: { "job-applications.json": { content: data } },
    }),
  });
  if (!res.ok) throw new Error(`Gist update failed: ${res.status}`);
}

export async function loadFromGist(): Promise<boolean> {
  if (!isConfigured()) return false;

  updateStatus("Syncing...", true);
  try {
    const content = await fetchGist();
    if (content) {
      localStorage.setItem(STORAGE_KEY, content);
      lastBackupData = content;
      updateStatus("Synced");
      return true;
    }
    updateStatus("Gist empty");
    return false;
  } catch (e) {
    console.error("Load from gist failed:", e);
    updateStatus("Sync failed");
    return false;
  }
}

export async function backupNow(): Promise<void> {
  if (!isConfigured()) return;

  const data = localStorage.getItem(STORAGE_KEY) || "[]";
  if (data === lastBackupData) {
    return;
  }

  updateStatus("Backing up...", true);
  try {
    await pushToGist(data);
    lastBackupData = data;
    updateStatus("Backed up");
  } catch (e) {
    console.error("Backup failed:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    updateStatus(`Failed: ${msg}`);
  }
}

export function startBackupTimer(): void {
  if (backupTimer !== null) clearInterval(backupTimer);
  if (!isConfigured()) return;
  backupTimer = window.setInterval(backupNow, BACKUP_INTERVAL_MS);
}

export function clearConfig(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(GIST_ID_KEY);
  localStorage.removeItem(STORAGE_KEY);
  lastBackupData = "";
  if (backupTimer !== null) clearInterval(backupTimer);
}
