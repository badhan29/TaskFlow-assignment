import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasksByProject } from "../../api/task.api";

const ACCENTS = [
  { from: "#6366f1", to: "#8b5cf6" },
  { from: "#10b981", to: "#059669" },
  { from: "#f59e0b", to: "#d97706" },
  { from: "#ef4444", to: "#dc2626" },
  { from: "#3b82f6", to: "#2563eb" },
];

const ProjectCard = ({ project, onDelete, index = 0 }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  useEffect(() => {
    let mounted = true;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await getTasksByProject(project._id);
        if (!mounted) return;
        setTasks(res.data?.data || []);
      } catch {}
      finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTasks();
    return () => { mounted = false; };
  }, [project._id]);

  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <>
      <div className="pc-card" onClick={() => navigate(`/tasks/${project._id}`)}>
        <div className="pc-accent-bar" style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }} />
        <div className="pc-label">Project</div>
        <h3 className="pc-title">{project.title}</h3>
        {project.description && <p className="pc-desc">{project.description}</p>}

        {tasks.length > 0 && (
          <>
            <div className="pc-progress-bar">
              <div className="pc-progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }} />
            </div>
            <div className="pc-progress-label">{progress}% · {done}/{tasks.length} done</div>
          </>
        )}

        <div className="pc-footer">
          <div className="pc-task-count">
            <strong>{loading ? "…" : tasks.length}</strong> tasks
          </div>
          <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
            <button className="pc-open-btn" onClick={() => navigate(`/tasks/${project._id}`)}>Open →</button>
            <button className="pc-del-btn" onClick={() => onDelete(project._id)} title="Delete project">✕</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;