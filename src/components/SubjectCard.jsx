import { useState } from "react";
import { MdExpandMore, MdExpandLess, MdDelete, MdAdd } from "react-icons/md";
import { getStatusColor } from "../utils/helpers";
import "./SubjectCard.css";

export default function SubjectCard({ subject, topics, onAddTopic, onDeleteTopic, onUpdateTopic, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: "", difficulty: "Medium", status: "Not Started", notes: "" });

  const handleAddTopic = () => {
    if (!newTopic.name.trim()) return;
    onAddTopic({ ...newTopic, subjectId: subject.id });
    setNewTopic({ name: "", difficulty: "Medium", status: "Not Started", notes: "" });
    setShowTopicForm(false);
  };

  const completedCount = topics.filter((t) => t.status === "Completed").length;

  return (
    <div className="subject-card card">
      <div className="subject-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="subject-info">
          <span className="subject-dot" style={{ background: subject.color }} />
          <div>
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
          </div>
        </div>
        <div className="subject-meta">
          <span className="topic-count">{completedCount}/{topics.length} topics</span>
          <button className="btn btn-ghost icon-btn" onClick={(e) => { e.stopPropagation(); onDelete(subject.id); }}>
            <MdDelete />
          </button>
          <span className="expand-icon">{expanded ? <MdExpandLess /> : <MdExpandMore />}</span>
        </div>
      </div>

      {expanded && (
        <div className="subject-topics">
          {topics.length === 0 && <p className="no-topics">No topics yet.</p>}
          {topics.map((topic) => (
            <div key={topic.id} className="topic-row">
              <div className="topic-left">
                <span className="topic-name">{topic.name}</span>
                <span className={`badge ${getStatusColor(topic.status)}`}>{topic.status}</span>
                <span className="topic-difficulty">{topic.difficulty}</span>
              </div>
              <div className="topic-actions">
                <select
                  value={topic.status}
                  onChange={(e) => onUpdateTopic(topic.id, { status: e.target.value })}
                  className="status-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Needs Revision</option>
                </select>
                <button className="btn btn-danger icon-btn" onClick={() => onDeleteTopic(topic.id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}

          {showTopicForm ? (
            <div className="topic-form">
              <input
                placeholder="Topic name"
                value={newTopic.name}
                onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
              />
              <select value={newTopic.difficulty} onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value })}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <div className="topic-form-actions">
                <button className="btn btn-primary" onClick={handleAddTopic}>Add</button>
                <button className="btn btn-ghost" onClick={() => setShowTopicForm(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-ghost add-topic-btn" onClick={() => setShowTopicForm(true)}>
              <MdAdd /> Add Topic
            </button>
          )}
        </div>
      )}
    </div>
  );
}
