import { createContext, useContext, useState, useEffect } from "react";

const StudyContext = createContext();

const SAMPLE_SUBJECTS = [
  { id: "1", name: "Data Structures", description: "Arrays, Trees, Graphs and more", color: "#7c6af7" },
  { id: "2", name: "Algorithms", description: "Sorting, searching, DP", color: "#34d399" },
  { id: "3", name: "Mathematics", description: "Discrete math, calculus", color: "#fbbf24" },
];

const SAMPLE_TOPICS = [
  { id: "1", subjectId: "1", name: "Binary Trees", difficulty: "Medium", status: "Completed", notes: "Understand traversal methods" },
  { id: "2", subjectId: "1", name: "Graph Algorithms", difficulty: "Hard", status: "In Progress", notes: "BFS and DFS covered" },
  { id: "3", subjectId: "2", name: "Dynamic Programming", difficulty: "Hard", status: "Not Started", notes: "" },
  { id: "4", subjectId: "2", name: "Sorting Algorithms", difficulty: "Easy", status: "Completed", notes: "Merge sort, Quick sort done" },
];

const SAMPLE_TASKS = [
  { id: "1", title: "Solve 10 binary tree problems", subject: "1", topic: "1", deadline: "2025-08-10", priority: "High", status: "Pending" },
  { id: "2", title: "Revise Graph algorithms", subject: "1", topic: "2", deadline: "2025-08-05", priority: "Medium", status: "Pending" },
  { id: "3", title: "Complete DP problem set", subject: "2", topic: "3", deadline: "2025-07-30", priority: "High", status: "Completed" },
  { id: "4", title: "Practice sorting questions", subject: "2", topic: "4", deadline: "2025-08-15", priority: "Low", status: "Pending" },
];

const SAMPLE_REVISIONS = [
  { id: "1", topicId: "1", topicName: "Binary Trees", subjectId: "1", revisionDate: "2025-08-08", completed: false },
  { id: "2", topicId: "4", topicName: "Sorting Algorithms", subjectId: "2", revisionDate: "2025-08-12", completed: false },
];

export function StudyProvider({ children }) {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("sc_subjects");
    return saved ? JSON.parse(saved) : SAMPLE_SUBJECTS;
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem("sc_topics");
    return saved ? JSON.parse(saved) : SAMPLE_TOPICS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("sc_tasks");
    return saved ? JSON.parse(saved) : SAMPLE_TASKS;
  });

  const [revisions, setRevisions] = useState(() => {
    const saved = localStorage.getItem("sc_revisions");
    return saved ? JSON.parse(saved) : SAMPLE_REVISIONS;
  });

  useEffect(() => { localStorage.setItem("sc_subjects", JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem("sc_topics", JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem("sc_tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("sc_revisions", JSON.stringify(revisions)); }, [revisions]);

  // Subject CRUD
  const addSubject = (subject) => setSubjects((prev) => [...prev, { ...subject, id: Date.now().toString() }]);
  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
  };

  // Topic CRUD
  const addTopic = (topic) => setTopics((prev) => [...prev, { ...topic, id: Date.now().toString() }]);
  const updateTopic = (id, updates) => setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  const deleteTopic = (id) => setTopics((prev) => prev.filter((t) => t.id !== id));

  // Task CRUD
  const addTask = (task) => setTasks((prev) => [...prev, { ...task, id: Date.now().toString() }]);
  const updateTask = (id, updates) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  // Revision
  const addRevision = (revision) => setRevisions((prev) => [...prev, { ...revision, id: Date.now().toString() }]);
  const toggleRevision = (id) =>
    setRevisions((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  const deleteRevision = (id) => setRevisions((prev) => prev.filter((r) => r.id !== id));

  return (
    <StudyContext.Provider
      value={{
        subjects, topics, tasks, revisions,
        addSubject, deleteSubject,
        addTopic, updateTopic, deleteTopic,
        addTask, updateTask, deleteTask,
        addRevision, toggleRevision, deleteRevision,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}
