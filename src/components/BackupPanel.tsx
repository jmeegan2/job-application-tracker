import { useState, useEffect } from "react";
import { setStatusCallback, backupNow, clearConfig } from "../utils/backup";

interface Props {
  onReset: () => void;
}

export function BackupPanel({ onReset }: Props) {
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setStatusCallback((msg, color) => {
      if (!msg) {
        setToast(null);
        return;
      }
      setToast({ msg, color });
    });
  }, []);

  const handleReset = () => {
    clearConfig();
    setShowConfirm(false);
    onReset();
  };

  return (
    <>
      {toast && (
        <div className="toast" style={{ borderLeftColor: toast.color }}>
          <span style={{ color: toast.color }}>{toast.msg}</span>
        </div>
      )}
      <div className="backup-bar">
        {showConfirm ? (
          <span className="reset-confirm">
            Clear backup settings?
            <button className="btn-text btn-text-danger" onClick={handleReset}>Yes, reset</button>
            <button className="btn-text" onClick={() => setShowConfirm(false)}>Cancel</button>
          </span>
        ) : (
          <>
            <button className="btn-text" onClick={backupNow}>Sync Now</button>
            <span className="backup-sep">|</span>
            <button className="btn-text btn-text-danger" onClick={() => setShowConfirm(true)}>Reset Backup</button>
          </>
        )}
      </div>
    </>
  );
}
