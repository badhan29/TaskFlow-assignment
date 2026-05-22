import { useState } from "react";
import { createTask } from "../../api/task.api";

export default function TaskForm({ projectId, onTaskAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setErr("Title is required");

    // Build payload — only include optional fields if filled
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      project: projectId,
    };
    if (form.dueDate) payload.dueDate = form.dueDate;
   

    try {
      setErr("");
      setLoading(true);
      const res = await createTask(payload);
      onTaskAdd(res.data.data);
      setForm({ title: "", description: "", priority: "medium", dueDate: "" });
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="tform-wrap" onSubmit={handleSubmit}>
        <p className="tform-title">+ New Task</p>

        {err && <div className="tform-err">⚠ {err}</div>}

        {/* Title */}
        <input
          className="tform-input"
          name="title"
          placeholder="Task title *"
          value={form.title}
          onChange={handleChange}
        />

        {/* Description */}
        <textarea
          className="tform-input tform-textarea"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        {/* Priority + Due Date */}
        <div className="tform-grid">
          <div>
            <label className="tform-label">Priority</label>
            <select
              className="tform-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">🔵 Low</option>
              <option value="medium">🟠 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
          <div>
            <label className="tform-label">Due Date</label>
            <input
              type="date"
              className="tform-input"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        <div className="tform-row">
          <button className="tform-submit" disabled={loading}>
            {loading ? "Adding…" : "Add Task"}
          </button>
        </div>
      </form>
    </>
  );
}