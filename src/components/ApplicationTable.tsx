import { useState, useMemo } from "react";
import { JobApplication, Stage, SortField, SortDir } from "../types";
import { ApplicationRow } from "./ApplicationRow";

interface Props {
  applications: JobApplication[];
  onUpdate: (id: string, field: keyof JobApplication, value: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  search: string;
  stageFilter: Stage | "All";
}

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
  { field: "date", label: "Date" },
  { field: "company", label: "Company" },
  { field: "title", label: "Title" },
];

export function ApplicationTable({ applications, onUpdate, onDelete, onAdd, search, stageFilter }: Props) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let apps = applications;
    if (stageFilter !== "All") {
      apps = apps.filter((a) => a.stage === stageFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.date.includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.link.toLowerCase().includes(q) ||
          a.estComp.toLowerCase().includes(q) ||
          a.stage.toLowerCase().includes(q) ||
          a.notes.toLowerCase().includes(q)
      );
    }
    return apps;
  }, [applications, search, stageFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="sort-icon muted">&uarr;&darr;</span>;
    return <span className="sort-icon active">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {SORTABLE_COLUMNS.map(({ field, label }) => (
              <th key={field} className="sortable" onClick={() => handleSort(field)}>
                {label} {sortIcon(field)}
              </th>
            ))}
            <th>Link</th>
            <th className="sortable" onClick={() => handleSort("estComp")}>
              Est Comp {sortIcon("estComp")}
            </th>
            <th className="sortable" onClick={() => handleSort("stage")}>
              Stage {sortIcon("stage")}
            </th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={8} className="empty-state">
                {applications.length === 0
                  ? "No applications yet."
                  : "No results match your filters."}
              </td>
            </tr>
          ) : (
            sorted.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
          <tr>
            <td colSpan={8}>
              <button className="add-row-btn" onClick={onAdd}>+ Add Application</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
