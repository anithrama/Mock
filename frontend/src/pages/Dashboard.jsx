import { useEffect, useState } from "react";
import api from "../api";
import getApiError from "../utils/getApiError";

function Dashboard() {
  const [data, setData] = useState({
    successRate: 0,
    mostSuccessfulCategory: null,
    averageRating: 0,
    evaluatedCount: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/analytics");
        setData(response.data);
      } catch (loadError) {
        setError(getApiError(loadError, "Failed to load analytics"));
      }
    };

    loadAnalytics();
  }, []);

  return (
    <section className="stack">
      <h2>Analytics Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="grid-3">
        <div className="metric">
          <h4>Success Rate</h4>
          <p>{data.successRate}%</p>
        </div>
        <div className="metric">
          <h4>Most Successful Category</h4>
          <p>{data.mostSuccessfulCategory || "N/A"}</p>
        </div>
        <div className="metric">
          <h4>Average Rating</h4>
          <p>{data.averageRating} / 5</p>
        </div>
      </div>
      <p className="subtle">Evaluated decisions: {data.evaluatedCount}</p>
    </section>
  );
}

export default Dashboard;

