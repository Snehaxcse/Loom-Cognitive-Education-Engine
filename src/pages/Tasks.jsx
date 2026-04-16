import { useState } from "react";
import { MdAdd, MdTask } from "react-icons/md";
import { useStudy } from "../context/StudyContext";
import { useDebounce } from "../hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import "./Tasks.css";

const TABS = ["All", "Pending", "Completed", "Overdue", "Revision"];

// Yup Schema to enforce validation per PRD requirements
const taskSchema = yup.object({
  title: yup.string().required("Task title is required!"),
  subject: yup.string(),
  topic: yup.string(),
  deadline: yup.string(),
  priority: yup.string(),
  status: yup.string()
});

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, subjects, topics } = useStudy();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  // useDebounce is heavily commented in the hooks file - it delays filtering until typing stops
  const debouncedSearch = useDebounce(search, 300);
  
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [showModal, setShowModal] = useState(false);

  // useForm handling simplifies state logic required by PRD
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { priority: "Medium", status: "Pending", subject: "", topic: "" }
  });

  const selectedSubject = watch("subject");
  const filteredTopics = topics.filter((t) => !selectedSubject || t.subjectId === selectedSubject);

  // Filter tasks using our standard variables instead of complex memoization
  let displayed = [...tasks];

  // Tab filter
  if (activeTab === "Pending") displayed = displayed.filter((t) => t.status === "Pending");
  else if (activeTab === "Completed") displayed = displayed.filter((t) => t.status === "Completed");
  else if (activeTab === "Overdue") {
    displayed = displayed.filter((t) => {
      if (t.status !== "Pending" || !t.deadline) return false;
      const d = new Date(t.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d < today;
    });
  } else if (activeTab === "Revision") displayed = displayed.filter((t) => t.status === "Needs Revision");

  // Search filter uses the Debounced search term
  if (debouncedSearch) {
    displayed = displayed.filter((t) => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }

  // Filters
  if (filterSubject) displayed = displayed.filter((t) => t.subject === filterSubject);
  if (filterPriority) displayed = displayed.filter((t) => t.priority === filterPriority);

  // Sort
  displayed.sort((a, b) => {
    if (sortBy === "deadline") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === "priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
    }
    if (sortBy === "subject") {
      const sA = subjects.find((s) => s.id === a.subject)?.name || "";
      const sB = subjects.find((s) => s.id === b.subject)?.name || "";
      return sA.localeCompare(sB);
    }
    return 0;
  });

  const tabCounts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Overdue: tasks.filter((t) => {
      if (t.status !== "Pending" || !t.deadline) return false;
      return new Date(t.deadline) < new Date(new Date().setHours(0,0,0,0));
    }).length,
    Revision: tasks.filter((t) => t.status === "Needs Revision").length,
  };

  const onFormSubmit = (data) => {
    addTask(data);
    reset();
    setShowModal(false);
    toast.success("Task added successfully!");
  };

  const handleToggle = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    updateTask(id, { status: newStatus });
  };

  const handleDelete = (id) => {
    deleteTask(id);
    toast.info("Task deleted");
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Manage your study tasks using useDebounce, yup, and react-hook-form</p>
      </div>

      <div className="task-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="tasks-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="filter-select">
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
          <option value="deadline">Sort: Deadline</option>
          <option value="priority">Sort: Priority</option>
          <option value="subject">Sort: Subject</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Add Task
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="empty-state">
          <MdTask size={40} />
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="tasks-list">
          {displayed.map((task) => {
            const subject = subjects.find((s) => s.id === task.subject);
            return (
              <TaskCard
                key={task.id}
                task={task}
                subjectName={subject?.name}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              
              <div className="form-group">
                <label>Task Title *</label>
                <input placeholder="e.g. Solve 10 binary tree problems" {...register("title")} autoFocus />
                {errors.title && <p style={{color: "var(--red)", fontSize: "0.75rem", marginTop: 4}}>{errors.title.message}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select {...register("subject")}>
                    <option value="">None</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Topic</label>
                  <select {...register("topic")}>
                    <option value="">None</option>
                    {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" {...register("deadline")} />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select {...register("priority")}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select {...register("status")}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
