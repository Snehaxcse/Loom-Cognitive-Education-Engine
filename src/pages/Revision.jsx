import { useState } from "react";
import { MdAdd, MdEventRepeat } from "react-icons/md";
import { useStudy } from "../context/StudyContext";
import RevisionList from "../components/RevisionList";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify";
import "./Revision.css";

const EMPTY_FORM = { topicId: "", subjectId: "", revisionDate: new Date(), completed: false };

export default function Revision() {
  const { subjects, topics, revisions, addRevision, toggleRevision, deleteRevision } = useStudy();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filteredTopics = topics.filter((t) => !form.subjectId || t.subjectId === form.subjectId);

  const pendingRevisions = revisions.filter((r) => !r.completed);
  const completedRevisions = revisions.filter((r) => r.completed);

  const handleAdd = () => {
    if (!form.topicId || !form.revisionDate) {
      toast.error("Please select a topic and date");
      return;
    }
    const topic = topics.find((t) => t.id === form.topicId);
    
    // date-fns formatting string as required by PRD
    const formattedDate = format(form.revisionDate, "yyyy-MM-dd");

    addRevision({
      ...form,
      revisionDate: formattedDate,
      topicName: topic?.name || "Unknown Topic",
    });
    setForm(EMPTY_FORM);
    setShowModal(false);
    toast.success("Revision scheduled using react-calendar!");
  };

  const handleQuickSchedule = (topicId, daysFromNow) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;
    
    // Using date-fns addDays as required by the PRD
    const dateStr = format(addDays(new Date(), daysFromNow), "yyyy-MM-dd");

    addRevision({
      topicId,
      topicName: topic.name,
      subjectId: topic.subjectId,
      revisionDate: dateStr,
      completed: false,
    });
    toast.success(`Revision scheduled in ${daysFromNow} days`);
  };

  return (
    <div className="revision-page">
      <div className="page-header">
        <h1>Revision Planner</h1>
        <p>Schedule and track your revision sessions using date-fns and react-calendar.</p>
      </div>

      <div className="revision-toolbar">
        <div className="revision-stats">
          <span className="rev-stat">{pendingRevisions.length} pending</span>
          <span className="rev-stat done">{completedRevisions.length} done</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Schedule Revision
        </button>
      </div>

      {topics.filter((t) => t.status === "Completed").length > 0 && (
        <div className="quick-schedule card">
          <h3>Quick Schedule — Completed Topics</h3>
          <p className="quick-desc">Schedule a revision for any completed topic</p>
          <div className="quick-grid">
            {topics
              .filter((t) => t.status === "Completed")
              .slice(0, 6)
              .map((topic) => {
                const subject = subjects.find((s) => s.id === topic.subjectId);
                return (
                  <div key={topic.id} className="quick-topic-card">
                    <span className="quick-dot" style={{ background: subject?.color || "var(--accent)" }} />
                    <div className="quick-info">
                      <p className="quick-name">{topic.name}</p>
                      <p className="quick-sub">{subject?.name}</p>
                    </div>
                    <div className="quick-actions">
                      <button className="btn btn-ghost quick-btn" onClick={() => handleQuickSchedule(topic.id, 3)}>+3d</button>
                      <button className="btn btn-ghost quick-btn" onClick={() => handleQuickSchedule(topic.id, 7)}>+7d</button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="revision-sections">
        <div>
          <h2 className="section-title">Upcoming ({pendingRevisions.length})</h2>
          <RevisionList
            revisions={pendingRevisions}
            subjects={subjects}
            onToggle={toggleRevision}
            onDelete={deleteRevision}
          />
        </div>

        {completedRevisions.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2 className="section-title">Completed ({completedRevisions.length})</h2>
            <RevisionList
              revisions={completedRevisions}
              subjects={subjects}
              onToggle={toggleRevision}
              onDelete={deleteRevision}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule Revision</h2>

            <div className="form-group">
              <label>Subject (optional)</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value, topicId: "" })}
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Topic *</label>
              <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })}>
                <option value="">Select a topic</option>
                {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="form-group calendar-container">
              <label>Revision Date (react-calendar) *</label>
              <div className="calendar-box" style={{ background: "#fff", color: "#000", padding: "10px", borderRadius: "8px", marginTop: "8px" }}>
                <Calendar 
                  onChange={(date) => setForm({ ...form, revisionDate: date })} 
                  value={form.revisionDate} 
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
