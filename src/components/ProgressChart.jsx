import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "./ProgressChart.css";

export function CircularProgress({ percent, label }) {
  const data = [{ name: "Progress", value: percent, fill: "#7c6af7" }];

  return (
    <div className="circular-progress">
      <ResponsiveContainer width={140} height={140}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#2a2a38" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="circular-label">
        <span className="circular-percent">{percent}%</span>
        <span className="circular-text">{label}</span>
      </div>
    </div>
  );
}

export function SubjectProgressChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="subject-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
          <XAxis dataKey="name" tick={{ fill: "#9090aa", fontSize: 11 }} />
          <YAxis tick={{ fill: "#9090aa", fontSize: 11 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: "#16161d", border: "1px solid #2a2a38", borderRadius: 8 }}
            labelStyle={{ color: "#e2e2f0" }}
            formatter={(val) => [`${val}%`, "Completion"]}
          />
          <Bar dataKey="percent" radius={[4, 4, 0, 0]} fill="#7c6af7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
