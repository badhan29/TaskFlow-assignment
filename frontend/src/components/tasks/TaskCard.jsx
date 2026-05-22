import { useState } from "react";
import { deleteTask, updateTask } from "../../api/task.api";

const STATUS_CONFIG = {
  todo: {
    label: "Todo",
    icon: "○",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    color: "#aaa",
    dot: "#777",
  },
  "in-progress": {
    label: "In Progress",
    icon: "◑",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
    color: "#fbbf24",
    dot: "#f59e0b",
  },
  done: {
    label: "Done",
    icon: "●",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    color: "#34d399",
    dot: "#10b981",
  },
};

const PRIORITY_CONFIG = {
  high: { label: "High", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  medium: { label: "Med", color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  low: { label: "Low", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
};

const NEXT_STATUS = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const s = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const p = task.priority ? PRIORITY_CONFIG[task.priority] : null;

  const handleStatusChange = async (newStatus) => {
    if (busy) return;
    const prevStatus = task.status;
    onUpdate({ ...task, status: newStatus });
    try {
      setBusy(true);
      setErr("");
      const res = await updateTask(task._id, { status: newStatus });
      onUpdate(res.data.data);
    } catch (e) {
      onUpdate({ ...task, status: prevStatus });
      setErr(e.response?.data?.message || "Failed to update status");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      setBusy(true);
      setErr("");
      await deleteTask(task._id);
      onDelete(String(task._id));
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to delete");
      setBusy(false);
    }
  };

  return (
    <>
      <div className={`tc-card ${task.status === "done" ? "done-card" : ""}`}>
        <div
          className="tc-status-indicator"
          style={{ borderColor: s.dot, color: s.dot }}
        >
          {busy ? "…" : s.icon}
        </div>

        <div className="tc-body">
          <h3 className={`tc-title ${task.status === "done" ? "crossed" : ""}`}>
            {task.title}
          </h3>
          {task.description && <p className="tc-desc">{task.description}</p>}
          <div className="tc-meta">
            <span
              className="tc-badge"
              style={{
                background: s.bg,
                borderColor: s.border,
                color: s.color,
              }}
            >
              {s.icon} {s.label}
            </span>
            {p && (
              <span
                className="tc-badge"
                style={{
                  background: p.bg,
                  borderColor: "transparent",
                  color: p.color,
                }}
              >
                {p.label}
              </span>
            )}
            <span className="tc-date">
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {err && <div className="tc-err">⚠ {err}</div>}
        </div>

        <div className="tc-actions">
          {task.status !== "done" ? (
            <button
              className="tc-next-btn"
              style={{
                borderColor: STATUS_CONFIG[NEXT_STATUS[task.status]].border,
                color: STATUS_CONFIG[NEXT_STATUS[task.status]].color,
              }}
              onClick={() => handleStatusChange(NEXT_STATUS[task.status])}
              disabled={busy}
            >
              → {STATUS_CONFIG[NEXT_STATUS[task.status]].label}
            </button>
          ) : (
            <button
              className="tc-next-btn"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#64748b" }}
              onClick={() => handleStatusChange("todo")}
              disabled={busy}
            >
              ↺ Reopen
            </button>
          )}
          <button
            className="tc-delete-btn"
            onClick={handleDelete}
            disabled={busy}
          >
            delete
          </button>
        </div>
      </div>
    </>
  );
}
