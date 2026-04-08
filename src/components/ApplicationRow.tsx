import { useState, useRef, useEffect } from "react";
import { JobApplication, STAGES, stageColors, stageBgColors } from "../types";

interface Props {
  app: JobApplication;
  onUpdate: (id: string, field: keyof JobApplication, value: string) => void;
  onDelete: (id: string) => void;
}

export function ApplicationRow({ app, onUpdate, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.style.height = "auto";
      notesRef.current.style.height = notesRef.current.scrollHeight + "px";
    }
  }, [app.notes]);

  return (
    <tr className="app-row" style={{ borderLeft: `3px solid ${stageColors[app.stage]}`, background: stageBgColors[app.stage] }}>
      <td>
        <input
          type="date"
          value={app.date}
          onChange={(e) => onUpdate(app.id, "date", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={app.company}
          placeholder="Company name"
          onChange={(e) => onUpdate(app.id, "company", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={app.title}
          placeholder="Job title"
          onChange={(e) => onUpdate(app.id, "title", e.target.value)}
        />
      </td>
      <td className="link-cell">
        <input
          type="url"
          value={app.link}
          placeholder="https://..."
          onChange={(e) => onUpdate(app.id, "link", e.target.value)}
        />
        {app.link && (
          <a href={app.link.match(/^https?:\/\//) ? app.link : `https://${app.link}`} target="_blank" rel="noopener noreferrer" className="link-icon" title="Open link" tabIndex={-1} onMouseDown={(e) => e.preventDefault()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </td>
      <td>
        <input
          type="text"
          value={app.estComp}
          placeholder="$000k"
          onChange={(e) => onUpdate(app.id, "estComp", e.target.value)}
        />
      </td>
      <td>
        <select
          value={app.stage}
          onChange={(e) => onUpdate(app.id, "stage", e.target.value)}
          style={{ color: stageColors[app.stage] }}
          className="stage-select"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td>
        <textarea
          ref={notesRef}
          value={app.notes}
          placeholder="Notes..."
          onChange={(e) => onUpdate(app.id, "notes", e.target.value)}
          rows={1}
        />
      </td>
      <td>
        {confirming ? (
          <span className="confirm-delete">
            <button className="confirm-yes" onClick={() => onDelete(app.id)}>Yes</button>
            <button className="confirm-no" onClick={() => setConfirming(false)}>No</button>
          </span>
        ) : (
          <button className="delete-btn" onClick={() => setConfirming(true)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
}
