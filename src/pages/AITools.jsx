import { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { generateStudyContent } from "../services/aiService";
import { toast } from "react-toastify";
import "./AITools.css";

export default function AITools() {
  const { subjects, topics } = useStudy();
  const [topicInput, setTopicInput] = useState("");
  const [selectedTool, setSelectedTool] = useState("summary");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topicInput.trim()) {
      toast.error("Please enter a topic before generating!");
      return;
    }

    setLoading(true);
    setResult("Asking the AI..."); // Quick feedback

    try {
      // Delegating the heavy lifting to our aiService.js to keep components clean
      const text = await generateStudyContent(selectedTool, topicInput);
      if (!text) throw new Error("No response from AI");
      
      setResult(text);
      toast.success("AI Content Generated!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.info("Copied to clipboard!");
  };

  const handleTopicSelect = (e) => {
    const topicId = e.target.value;
    const topic = topics.find((t) => t.id === topicId);
    if (topic) setTopicInput(topic.name);
  };

  return (
    <div className="ai-tools-page">
      <div className="page-header">
        <h1>AI Study Assistant</h1>
        <p>Uses our aiService logic to securely generate study materials</p>
      </div>

      <div className="ai-tools-grid">
        <div className="input-panel">
          <div className="card">
            <h3 className="panel-title">Configure Request</h3>

            <div className="form-group">
              <label>What do you want to study?</label>
              <input
                placeholder="e.g. Binary Search Trees"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
              />
            </div>

            {topics.length > 0 && (
              <div className="form-group">
                <label>Or pick from your existing topics</label>
                <select onChange={handleTopicSelect} defaultValue="">
                  <option value="" disabled>Select a topic...</option>
                  {subjects.map((subj) => {
                    const subjTopics = topics.filter((t) => t.subjectId === subj.id);
                    if (subjTopics.length === 0) return null;
                    return (
                      <optgroup key={subj.id} label={subj.name}>
                        {subjTopics.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Select AI Tool</label>
              <select value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
                <option value="summary">Generate Summary</option>
                <option value="questions">Practice Questions</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{width: "100%", marginTop: "12px", padding: "12px"}}>
              {loading ? "Generating Output..." : "Generate AI Help"}
            </button>
          </div>
        </div>

        <div className="output-panel card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="output-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
            <h3 className="panel-title" style={{margin: 0}}>Response Result</h3>
            {result && !loading && (
              <button className="btn btn-ghost" onClick={handleCopy} style={{padding: "4px 8px"}}>
                Copy Text
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)"}}>
             {result ? (
               <pre className="result-text" style={{margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem"}}>{result}</pre>
             ) : (
               <p style={{ color: "var(--text2)", textAlign: "center", marginTop: "40px" }}>Your AI generated content will appear here</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
