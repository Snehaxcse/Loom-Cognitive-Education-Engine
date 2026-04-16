import { MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdFlag } from "react-icons/md";
import { formatDate, getPriorityColor, isOverdue } from "../utils/helpers";
import "./TaskCard.css";

export default function TaskCard({ task, subjectName, onDelete, onToggle }) {
  const overdue = task.status === "Pending" && isOverdue(task.deadline);

  return (
    <div className={`task-card card ${task.status === "Completed" ? "completed" : ""} ${overdue ? "overdue" : ""}`}>
      <div className="task-main">
        <button className="check-btn" onClick={() => onToggle(task.id)}>
          {task.status === "Completed" ? <MdCheckCircle className="checked" /> : <MdRadioButtonUnchecked />}
        </button>
        <div className="task-body">
          <p className={`task-title ${task.status === "Completed" ? "strikethrough" : ""}`}>{task.title}</p>
          <div className="task-meta-row">
            {subjectName && <span className="task-subject">{subjectName}</span>}
            <span className={`badge ${getPriorityColor(task.priority)}`}>
              <MdFlag style={{ marginRight: 3 }} />
              {task.priority}
            </span>
            {task.deadline && (
              <span className={`task-deadline ${overdue ? "overdue-text" : ""}`}>
                Due {formatDate(task.deadline)}
              </span>
            )}
          </div>
        </div>
        <button className="btn btn-danger icon-btn" onClick={() => onDelete(task.id)}>
          <MdDelete />
        </button>
      </div>
    </div>
  );
}
