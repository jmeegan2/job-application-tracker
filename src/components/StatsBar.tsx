import { JobApplication, Stage, STAGES, stageColors } from "../types";

interface Props {
  applications: JobApplication[];
  stageFilter: Stage | "All";
  onFilterChange: (stage: Stage | "All") => void;
}

export function StatsBar({ applications, stageFilter, onFilterChange }: Props) {
  const counts = STAGES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.stage === s).length;
    return acc;
  }, {} as Record<Stage, number>);

  return (
    <div className="stats-bar">
      <button
        className={`stage-pill ${stageFilter === "All" ? "active" : ""}`}
        onClick={() => onFilterChange("All")}
      >
        All <span className="pill-count">{applications.length}</span>
      </button>
      {STAGES.map((s) => (
        <button
          key={s}
          className={`stage-pill ${stageFilter === s ? "active" : ""}`}
          onClick={() => onFilterChange(s)}
          style={stageFilter === s ? { borderColor: stageColors[s], color: stageColors[s] } : {}}
        >
          <span className="pill-dot" style={{ background: stageColors[s] }} />
          {s} <span className="pill-count">{counts[s]}</span>
        </button>
      ))}
    </div>
  );
}
