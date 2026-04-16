export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  } catch {
    return false;
  }
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    const today = new Date();
    const diffTime = d - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case "High": return "badge-red";
    case "Medium": return "badge-yellow";
    case "Low": return "badge-blue";
    default: return "badge-gray";
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "Completed": return "badge-green";
    case "In Progress": return "badge-blue";
    case "Needs Revision": return "badge-yellow";
    case "Not Started": return "badge-gray";
    default: return "badge-gray";
  }
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}
