import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import getApiError from "../utils/getApiError";

const initialForm = {
  result: "Success",
  rating: 3,
  lessonsLearned: "",
  outcomeDate: "",
};

function AddOutcome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [outcomeId, setOutcomeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = useMemo(() => Boolean(outcomeId), [outcomeId]);

  useEffect(() => {
    const loadOutcome = async () => {
      try {
        const { data } = await api.get(`/outcomes/decision/${id}`);
        setOutcomeId(data._id);
        setFormData({
          result: data.result || "Success",
          rating: data.rating || 3,
          lessonsLearned: data.lessonsLearned || "",
          outcomeDate: data.outcomeDate ? data.outcomeDate.split("T")[0] : "",
        });
      } catch (_error) {
        setOutcomeId("");
      }
    };

    loadOutcome();
  }, [id]);

  const onChange = (event) => {
    const value = event.target.name === "rating" ? Number(event.target.value) : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  const validate = () => {
    if (!["Success", "Failure"].includes(formData.result)) return "Result is invalid";
    if (formData.rating < 1 || formData.rating > 5) return "Rating must be between 1 and 5";
    if (!formData.lessonsLearned.trim()) return "Lessons learned is required";
    if (!formData.outcomeDate) return "Outcome date is required";
    return "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/outcomes/${outcomeId}`, formData);
      } else {
        await api.post("/outcomes", { ...formData, decisionId: id });
      }
      navigate(`/decisions/${id}`);
    } catch (submitError) {
      setError(getApiError(submitError, "Failed to save outcome"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <h2>{isEdit ? "Update Outcome" : "Add Outcome"}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <select name="result" value={formData.result} onChange={onChange}>
          <option value="Success">Success</option>
          <option value="Failure">Failure</option>
        </select>

        <input
          type="number"
          name="rating"
          min={1}
          max={5}
          value={formData.rating}
          onChange={onChange}
        />

        <textarea
          name="lessonsLearned"
          placeholder="Lessons Learned"
          rows={4}
          value={formData.lessonsLearned}
          onChange={onChange}
        />

        <input
          type="date"
          name="outcomeDate"
          value={formData.outcomeDate}
          onChange={onChange}
        />

        <div className="row">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Outcome"}
          </button>
          <Link to={`/decisions/${id}`}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}

export default AddOutcome;
