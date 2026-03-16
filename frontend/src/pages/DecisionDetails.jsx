import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import getApiError from "../utils/getApiError";

function DecisionDetails() {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const decisionResponse = await api.get(`/decisions/${id}`);
        setDecision(decisionResponse.data);
      } catch (decisionError) {
        setError(getApiError(decisionError, "Failed to load decision"));
        return;
      }

      try {
        const outcomeResponse = await api.get(`/outcomes/decision/${id}`);
        setOutcome(outcomeResponse.data);
      } catch (_outcomeError) {
        setOutcome(null);
      }
    };

    loadData();
  }, [id]);

  const deleteOutcome = async () => {
    if (!outcome?._id) return;
    const allowDelete = window.confirm("Delete this outcome?");
    if (!allowDelete) return;

    try {
      await api.delete(`/outcomes/${outcome._id}`);
      setOutcome(null);
    } catch (deleteError) {
      setError(getApiError(deleteError, "Failed to delete outcome"));
    }
  };

  if (!decision) {
    return (
      <section>
        {error ? <p className="error">{error}</p> : <p>Loading...</p>}
      </section>
    );
  }

  return (
    <section className="stack">
      <h2>{decision.title}</h2>
      <p>
        <strong>Description:</strong> {decision.description}
      </p>
      <p>
        <strong>Category:</strong> {decision.category}
      </p>
      <p>
        <strong>Expected Outcome:</strong> {decision.expectedOutcome}
      </p>
      <p>
        <strong>Decision Date:</strong> {new Date(decision.decisionDate).toLocaleDateString()}
      </p>

      <div className="row">
        <Link to={`/decisions/${id}/edit`}>Edit Decision</Link>
        <Link to="/">Back to List</Link>
      </div>

      <hr />
      <h3>Outcome</h3>
      {outcome ? (
        <div className="card">
          <p>
            <strong>Result:</strong> {outcome.result}
          </p>
          <p>
            <strong>Rating:</strong> {outcome.rating} / 5
          </p>
          <p>
            <strong>Lessons Learned:</strong> {outcome.lessonsLearned}
          </p>
          <p>
            <strong>Outcome Date:</strong> {new Date(outcome.outcomeDate).toLocaleDateString()}
          </p>
          <div className="row">
            <Link to={`/decisions/${id}/outcome`}>Update Outcome</Link>
            <button className="danger" type="button" onClick={deleteOutcome}>
              Delete Outcome
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>No outcome added yet.</p>
          <Link to={`/decisions/${id}/outcome`}>Add Outcome</Link>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default DecisionDetails;
