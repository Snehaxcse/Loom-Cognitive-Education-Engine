import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StudyProvider } from "./context/StudyContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import Revision from "./pages/Revision";
import AITools from "./pages/AITools";
import "./App.css";

// A very simple wrapper that gives every page a small fade effect!
function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

// Separate component so we can use "useLocation" hook
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PageFade><Dashboard /></PageFade>} />
        <Route path="/subjects" element={<PageFade><Subjects /></PageFade>} />
        <Route path="/tasks" element={<PageFade><Tasks /></PageFade>} />
        <Route path="/revision" element={<PageFade><Revision /></PageFade>} />
        <Route path="/ai-tools" element={<PageFade><AITools /></PageFade>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <StudyProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
      <ToastContainer position="bottom-right" theme="dark" />
    </StudyProvider>
  );
}

export default App;
