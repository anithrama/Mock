import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import getApiError from "../utils/getApiError";

function DecisionList() {
  const [decisions, setDecisions] = useState([]);
  const [error, setError] = useState("");

  const loadDecisions = async () => {
    try {
      const { data } = await api.get("/decisions");
      setDecisions(data);
    } catch (loadError) {
      setError(getApiError(loadError, "Failed to fetch decisions"));
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const deleteDecision = async (id) => {
    const allowDelete = window.confirm("Delete this decision?");
    if (!allowDelete) return;

    try {
      await api.delete(`/decisions/${id}`);
      setDecisions((prev) => prev.filter((decision) => decision._id !== id));
    } catch (deleteError) {
      setError(getApiError(deleteError, "Failed to delete decision"));
    }
  };

  return (
    <section className="stack">
      <h2>Decision List</h2>
      {error && <p className="error">{error}</p>}
      {decisions.length === 0 && <p>No decisions yet. Add your first one.</p>}

      <div className="stack">
        {decisions.map((decision) => (
          <article key={decision._id} className="card">
            <h3>{decision.title}</h3>
            <p>
              <strong>Category:</strong> {decision.category}
            </p>
            <p>
              <strong>Decision Date:</strong>{" "}
              {new Date(decision.decisionDate).toLocaleDateString()}
            </p>
            <div className="row">
              <Link to={`/decisions/${decision._id}`}>View</Link>
              <Link to={`/decisions/${decision._id}/edit`}>Edit</Link>
              <button className="danger" type="button" onClick={() => deleteDecision(decision._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DecisionList;
