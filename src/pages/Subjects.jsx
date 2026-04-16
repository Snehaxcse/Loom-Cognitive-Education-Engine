import { useState } from "react";
import { MdAdd, MdFolder } from "react-icons/md";
import { useStudy } from "../context/StudyContext";
import SubjectCard from "../components/SubjectCard";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";
import "./Subjects.css";

const COLORS = ["#7c6af7", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#a78bfa"];

export default function Subjects() {
  const { subjects, topics, addSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useStudy();
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", description: "", color: COLORS[0] });
  const [search, setSearch] = useState("");

  const displayedSubjects = search
    ? subjects.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : subjects;

  const handleAdd = () => {
    if (!newSubject.name.trim()) {
      toast.error("Subject name is required");
      return;
    }
    addSubject(newSubject);
    setNewSubject({ name: "", description: "", color: COLORS[0] });
    setShowModal(false);
    toast.success("Subject added successfully!");
  };

  const handleDelete = (id) => {
    deleteSubject(id);
    toast.info("Subject deleted");
  };

  const getTopicsForSubject = (subjectId) => topics.filter((t) => t.subjectId === subjectId);

  return (
    <div className="subjects-page">
      <div className="page-header">
        <h1>Subjects</h1>
        <p>Manage your subjects and topics</p>
      </div>

      <div className="subjects-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Add Subject
        </button>
      </div>

      <div className="subjects-stats">
        <span>{subjects.length} subjects</span>
        <span>{topics.length} total topics</span>
        <span>{topics.filter((t) => t.status === "Completed").length} completed topics</span>
      </div>

      {displayedSubjects.length === 0 ? (
        <div className="empty-state">
          <MdFolder size={40} />
          <p>{search ? "No subjects match your search" : "No subjects yet — add one!"}</p>
        </div>
      ) : (
        <div className="subjects-list">
          {displayedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              topics={getTopicsForSubject(subject.id)}
              onAddTopic={addTopic}
              onDeleteTopic={deleteTopic}
              onUpdateTopic={updateTopic}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Subject</h2>

            <div className="form-group">
              <label>Subject Name *</label>
              <input
                placeholder="e.g. Data Structures"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                placeholder="Brief description (optional)"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Color Label</label>
              <div className="color-picker">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${newSubject.color === color ? "selected" : ""}`}
                    style={{ background: color }}
                    onClick={() => setNewSubject({ ...newSubject, color })}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
