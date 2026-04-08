import { useState } from "react";
import { setToken, setGistId, createNewGist, findExistingGists, GistMatch } from "../utils/backup";

interface Props {
  onComplete: () => void;
}

type Step = "token" | "searching" | "choose" | "not-found" | "creating";

const STEP_NUMBER: Record<Step, number> = {
  token: 1,
  searching: 1,
  choose: 2,
  "not-found": 2,
  creating: 2,
};

export function SetupFlow({ onComplete }: Props) {
  const [step, setStep] = useState<Step>("token");
  const [token, setTokenInput] = useState("");
  const [matches, setMatches] = useState<GistMatch[]>([]);
  const [error, setError] = useState("");

  const handleTokenSubmit = async () => {
    if (!token.trim()) return;
    setError("");
    setStep("searching");
    try {
      const found = await findExistingGists(token.trim());
      if (found.length > 0) {
        setMatches(found);
        setStep("choose");
      } else {
        setStep("not-found");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to check gists");
      setStep("token");
    }
  };

  const handlePickGist = (id: string) => {
    setToken(token.trim());
    setGistId(id);
    onComplete();
  };

  const handleCreateNew = async () => {
    setError("");
    setStep("creating");
    try {
      const newId = await createNewGist(token.trim());
      setToken(token.trim());
      setGistId(newId);
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create gist");
      setStep("not-found");
    }
  };

  const currentStep = STEP_NUMBER[step];

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        <h2>Job Application Tracker</h2>
        <p className="setup-subtitle">Set up backup to get started.</p>

        <div className="progress-dots">
          <span className={`dot ${currentStep >= 1 ? "active" : ""}`} />
          <span className={`dot ${currentStep >= 2 ? "active" : ""}`} />
        </div>

        {(step === "token" || step === "searching") && (
          <div className="setup-step">
            <label>GitHub Personal Access Token</label>
            <p className="setup-hint">
              Needs the <code>gist</code> scope.{" "}
              <a href="https://github.com/settings/tokens/new?scopes=gist&description=JobApplicationTracker" target="_blank" rel="noopener noreferrer">
                Create one here
              </a>
            </p>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx..."
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTokenSubmit()}
              autoFocus
              disabled={step === "searching"}
            />
            {error && <p className="setup-error">{error}</p>}
            <div className="setup-buttons">
              <button
                className="btn-primary"
                onClick={handleTokenSubmit}
                disabled={!token.trim() || step === "searching"}
              >
                {step === "searching" ? "Checking..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "choose" && (
          <div className="setup-step">
            <p>Found {matches.length} existing backup{matches.length !== 1 ? "s" : ""}:</p>
            <div className="gist-list">
              {matches.map((g) => (
                <button key={g.id} className="gist-option" onClick={() => handlePickGist(g.id)}>
                  <span className="gist-id">{g.id.slice(0, 12)}...</span>
                  <span className="gist-date">Updated {new Date(g.updatedAt).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
            <div className="setup-divider">
              <span>or</span>
            </div>
            <div className="setup-buttons">
              <button className="btn-primary" onClick={handleCreateNew}>
                Create New Backup
              </button>
              <button className="btn-secondary" onClick={() => setStep("token")}>
                Back
              </button>
            </div>
          </div>
        )}

        {(step === "not-found" || step === "creating") && (
          <div className="setup-step">
            <p>No existing backups found.</p>
            {error && <p className="setup-error">{error}</p>}
            <div className="setup-buttons">
              <button
                className="btn-primary"
                onClick={handleCreateNew}
                disabled={step === "creating"}
              >
                {step === "creating" ? "Creating..." : "Create New Backup"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setStep("token")}
                disabled={step === "creating"}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
