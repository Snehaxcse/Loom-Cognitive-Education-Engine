import { MdCheckCircle, MdRadioButtonUnchecked, MdDelete, MdEventRepeat } from "react-icons/md";
import { formatDate, isOverdue } from "../utils/helpers";
import "./RevisionList.css";

export default function RevisionList({ revisions, subjects, onToggle, onDelete }) {
  if (revisions.length === 0) {
    return (
      <div className="empty-state">
        <MdEventRepeat size={40} />
        <p>No revision sessions planned</p>
      </div>
    );
  }

  return (
    <div className="revision-list">
      {revisions.map((r) => {
        const subject = subjects.find((s) => s.id === r.subjectId);
        const overdue = !r.completed && isOverdue(r.revisionDate);

        return (
          <div key={r.id} className={`revision-item card ${r.completed ? "done" : ""} ${overdue ? "overdue" : ""}`}>
            <button className="check-btn" onClick={() => onToggle(r.id)}>
              {r.completed ? <MdCheckCircle className="checked" /> : <MdRadioButtonUnchecked />}
            </button>
            <div className="revision-info">
              <p className={`revision-topic ${r.completed ? "strikethrough" : ""}`}>{r.topicName}</p>
              <div className="revision-meta">
                {subject && (
                  <span className="revision-subject" style={{ color: subject.color }}>
                    {subject.name}
                  </span>
                )}
                <span className={`revision-date ${overdue ? "overdue-text" : ""}`}>
                  {formatDate(r.revisionDate)}
                  {overdue && " • Overdue"}
                </span>
              </div>
            </div>
            <button className="btn btn-danger icon-btn" onClick={() => onDelete(r.id)}>
              <MdDelete />
            </button>
          </div>
        );
      })}
    </div>
  );
}
