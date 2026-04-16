import { useEffect, useState } from "react";
import { MdTask, MdCheckCircle, MdPending, MdEventRepeat } from "react-icons/md";
import { useStudy } from "../context/StudyContext";
import { CircularProgress, SubjectProgressChart } from "../components/ProgressChart";
import { formatDate } from "../utils/helpers";
import "./Dashboard.css";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ color, background: `${color}22` }}>{icon}</div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, topics, revisions, subjects } = useStudy();
  const [quote, setQuote] = useState(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const subjectProgress = subjects.map((s) => {
    const subjectTopics = topics.filter((t) => t.subjectId === s.id);
    const completed = subjectTopics.filter((t) => t.status === "Completed").length;
    return {
      name: s.name,
      total: subjectTopics.length,
      completed,
      percent: subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0,
      color: s.color,
    };
  });

  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const revisionCount = revisions.filter((r) => !r.completed).length;

  const upcomingRevisions = revisions
    .filter((r) => !r.completed)
    .slice(0, 4);

  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=education,inspirational")
      .then((r) => r.json())
      .then((d) => setQuote(d))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Track your overall study progress</p>
      </div>

      {quote && (
        <div className="quote-banner card">
          <p className="quote-text">"{quote.content}"</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}

      <div className="stats-grid">
        <StatCard icon={<MdTask />} label="Total Tasks" value={totalTasks} color="#7c6af7" />
        <StatCard icon={<MdCheckCircle />} label="Completed" value={completedTasks} color="#34d399" />
        <StatCard icon={<MdPending />} label="Pending" value={pendingTasks} color="#fbbf24" />
        <StatCard icon={<MdEventRepeat />} label="Revisions Due" value={revisionCount} color="#60a5fa" />
      </div>

      <div className="dashboard-grid">
        <div className="card progress-card">
          <h3>Overall Completion</h3>
          <div className="progress-center">
            <CircularProgress percent={completionPercent} label="Completed" />
          </div>
        </div>

        <div className="card subject-progress-card">
          <h3>Subject Progress</h3>
          {subjectProgress.length > 0 ? (
            <SubjectProgressChart data={subjectProgress} />
          ) : (
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 12 }}>No subjects yet</p>
          )}
        </div>

        <div className="card upcoming-card">
          <h3>Upcoming Revisions</h3>
          {upcomingRevisions.length === 0 ? (
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 10 }}>No upcoming revisions</p>
          ) : (
            <div className="upcoming-list">
              {upcomingRevisions.map((r) => {
                const subject = subjects.find((s) => s.id === r.subjectId);
                return (
                  <div key={r.id} className="upcoming-item">
                    <div className="upcoming-dot" style={{ background: subject?.color || "var(--accent)" }} />
                    <div>
                      <p className="upcoming-topic">{r.topicName}</p>
                      <p className="upcoming-date">{formatDate(r.revisionDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
