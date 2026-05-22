import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTasksByProject } from "../api/task.api";
import API from "../api/project.api";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import { showError } from "../utils/notification";

const STATUS_FILTERS = [
  { key: "all", label: "All Tasks", emoji: "◈" },
  { key: "todo", label: "Todo", emoji: "○" },
  { key: "in-progress", label: "In Progress", emoji: "◑" },
  { key: "done", label: "Done", emoji: "●" },
];

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchProject = async () => {
    try {
      const res = await API.get("/projects");
      const found = res.data.projects.find((p) => p._id === projectId);
      setProject(found || null);
    } catch (err) {
      setError("Failed to load project");
      showError(err, "Failed to load project");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasksByProject(projectId);
      setTasks(res.data?.data || []);
    } catch (err) {
      setError("Failed to load tasks");
      showError(err, "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProject();
    fetchTasks();
  }, [projectId]);

  const handleTaskAdd = (task) => {
    setTasks((prev) => [task, ...prev]);
    setShowForm(false);
  };

  const handleTaskUpdate = (updated) => {
    setTasks((prev) =>
      prev.map((t) => (String(t._id) === String(updated._id) ? updated : t)),
    );
  };

  const handleTaskDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const taskStats = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  const progress =
    tasks.length > 0 ? Math.round((taskStats.done / tasks.length) * 100) : 0;

  if (!project && !error && loading === false && tasks.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8fafc" }}
      >
        <div
          style={{
            color: "#64748b",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
          }}
        >
          Loading project…
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <header className="tf-header">
        <div className="tf-header-inner">
          <button className="tf-back-btn" onClick={() => navigate("/projects")}>
            ← Projects
          </button>
          <button
            className={`tf-add-btn ${showForm ? "cancel" : ""}`}
            onClick={() => setShowForm((s) => !s)}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {showForm ? "×" : "+"}
            </span>
            {showForm ? "Cancel" : "New Task"}
          </button>
        </div>
      </header>

      <main className="tf-main">
        <div className="tf-project-header">
          <h1 className="tf-project-name">{project?.title || "Tasks"}</h1>
          {project?.description && (
            <p className="tf-project-desc">{project.description}</p>
          )}
          {tasks.length > 0 && (
            <>
              <div className="tf-progress-bar">
                <div
                  className="tf-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="tf-progress-label">
                {progress}% complete · {taskStats.done} of {tasks.length} tasks
                done
              </div>
            </>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="tf-filters">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`tf-filter-btn ${activeFilter === f.key ? "active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                <span>{f.emoji}</span>
                {f.label}
                <span className="count">{taskStats[f.key] ?? 0}</span>
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <div style={{ marginBottom: 20 }}>
            <TaskForm projectId={projectId} onTaskAdd={handleTaskAdd} />
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="tf-empty">
            <div className="tf-empty-title">Loading tasks…</div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="tf-empty">
            <div className="tf-empty-icon">
              {activeFilter === "all"
                ? "✦"
                : activeFilter === "todo"
                  ? "○"
                  : activeFilter === "in-progress"
                    ? "◑"
                    : "●"}
            </div>
            <div className="tf-empty-title">
              {activeFilter === "all"
                ? "No tasks yet"
                : `No "${activeFilter === "in-progress" ? "In Progress" : activeFilter}" tasks`}
            </div>
            <div className="tf-empty-sub">
              {activeFilter === "all"
                ? 'Click "New Task" to add your first one.'
                : "Tasks with this status will appear here."}
            </div>
          </div>
        ) : (
          <div className="tf-task-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
