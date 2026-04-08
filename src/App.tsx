import { useState } from "react";
import { useApplications } from "./hooks/useApplications";
import { ApplicationTable } from "./components/ApplicationTable";
import { BackupPanel } from "./components/BackupPanel";
import { SetupFlow } from "./components/SetupFlow";
import { StatsBar } from "./components/StatsBar";
import { isConfigured } from "./utils/backup";
import { Stage } from "./types";
import "./App.css";

export default function App() {
  const { applications, addApplication, updateApplication, deleteApplication, refreshFromGist, ready } = useApplications();
  const [configured, setConfigured] = useState(isConfigured());
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");

  const handleSetupComplete = () => {
    setConfigured(true);
    refreshFromGist();
  };

  const handleReset = () => {
    setConfigured(false);
  };

  if (!configured) {
    return <SetupFlow onComplete={handleSetupComplete} />;
  }

  if (!ready) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner" />
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>Job Application Tracker</h1>
          <span className="app-count">{applications.length} application{applications.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search company, title, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </header>
      <StatsBar
        applications={applications}
        stageFilter={stageFilter}
        onFilterChange={setStageFilter}
      />
      <ApplicationTable
        applications={applications}
        onUpdate={updateApplication}
        onDelete={deleteApplication}
        onAdd={addApplication}
        search={search}
        stageFilter={stageFilter}
      />
      <BackupPanel onReset={handleReset} />
    </div>
  );
}
