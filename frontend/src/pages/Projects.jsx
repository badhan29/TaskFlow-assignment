import { useEffect, useState } from "react";
import API from "../api/project.api";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ProjectCard from "../components/common/ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data.projects);
    } catch {}
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    try {
      setError("");
      setLoading(true);
      const { data } = await API.post("/projects", { title, description });
      setProjects((prev) => [data.project, ...prev]);
      setTitle(""); setDescription(""); setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {}
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <header className="pp-header">
        <div className="pp-header-inner">
          <span className="pp-logo">TaskFlow</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="pp-count">{projects.length} projects</span>
            <button
              className={`pp-add-btn ${showForm ? "cancel" : ""}`}
              onClick={() => setShowForm((p) => !p)}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{showForm ? "×" : "+"}</span>
              {showForm ? "Cancel" : "New Project"}
            </button>
          </div>
        </div>
      </header>

      <main className="pp-main">
        <div className="pp-hero">
          <h1>Your Projects</h1>
          <p>Manage all your work in one focused space.</p>
        </div>

        {showForm && (
          <div className="pp-form-wrap">
            <p className="pp-form-title">+ Create New Project</p>
            {error && <div className="pp-err">⚠ {error}</div>}
            <form onSubmit={handleCreateProject}>
              <div className="pp-form-grid">
                <input
                  className="pp-input"
                  placeholder="Project title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="pp-input pp-textarea"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="pp-form-actions">
                <button className="pp-create-btn" disabled={loading}>
                  {loading ? "Creating…" : "Create Project →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-icon">✦</div>
            <div className="pp-empty-title">No projects yet</div>
            <div className="pp-empty-sub">
              <span className="pp-empty-link" onClick={() => setShowForm(true)}>Create your first project</span> to get started.
            </div>
          </div>
        ) : (
          <div className="pp-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} onDelete={handleDelete} index={index} />
            ))}
            <button className="pp-new-card" onClick={() => setShowForm(true)}>
              <div className="pp-new-icon">+</div>
              <span>New project</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;