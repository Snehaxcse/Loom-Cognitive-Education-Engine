import { NavLink } from "react-router-dom";
import { MdDashboard, MdMenuBook, MdTask, MdEventRepeat, MdAutoAwesome } from "react-icons/md";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
  { to: "/subjects", icon: <MdMenuBook />, label: "Subjects" },
  { to: "/tasks", icon: <MdTask />, label: "Tasks" },
  { to: "/revision", icon: <MdEventRepeat />, label: "Revision" },
  { to: "/ai-tools", icon: <MdAutoAwesome />, label: "AI Tools" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">✦</span>
        <span className="logo-text">StudyAI</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Study Companion</p>
        <p>v1.0.0</p>
      </div>
    </aside>
  );
}
