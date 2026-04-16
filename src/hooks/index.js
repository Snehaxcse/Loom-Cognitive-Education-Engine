import { useState, useEffect } from "react";
import { useStudy } from "../context/StudyContext";

/**
 * useTasks Hook
 * Custom hooks in React always start with "use".
 * This hook just takes the global study context and gives us only the "task" related tools.
 * It also pre-filters pending and completed tasks so our other files stay neat.
 */
export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStudy();

  // Simple arrays that filter the global list so we don't have to write this 10x times in our app.
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return { tasks, pendingTasks, completedTasks, addTask, updateTask, deleteTask };
}

/**
 * useSubjects Hook
 * Used to handle Subject and Topic data easily in any component.
 */
export function useSubjects() {
  const { subjects, topics, addSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useStudy();

  // A helper function to fetch topics that strictly belong to a specific subject ID
  const getTopicsForSubject = (subjectId) => topics.filter((t) => t.subjectId === subjectId);

  return { subjects, topics, getTopicsForSubject, addSubject, deleteSubject, addTopic, updateTopic, deleteTopic };
}

/**
 * useProgress Hook
 * This custom hook calculates completion percentages for our analytics dashboard.
 */
export function useProgress() {
  const { tasks, topics, subjects } = useStudy();

  // Total tasks vs Completed Tasks gives us out standard completion % meter
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // We loop (map) through each subject to figure out its individual progress
  const subjectProgress = subjects.map((s) => {
    // Only topics belonging to this 's' (subject)
    const subjectTopics = topics.filter((t) => t.subjectId === s.id);
    const completed = subjectTopics.filter((t) => t.status === "Completed").length;
    
    return {
      name: s.name,
      total: subjectTopics.length,
      completed: completed,
      // If total topics > 0, calculate percentage, otherwise it's 0%
      percent: subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0,
      color: s.color,
    };
  });

  return { totalTasks, completedTasks, completionPercent, subjectProgress };
}

/**
 * useDebounce Hook
 * This is an advanced optimization hook requested by the PRD.
 * "Debouncing" means waiting for a user to pause typing before running search/filtering!
 * Wait a little bit (e.g. 300ms) before returning the value instead of setting state on every single keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Only update debounced value after the specified delay has passed
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: If the user types another key before the delay finishes, clear it and restart
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}
