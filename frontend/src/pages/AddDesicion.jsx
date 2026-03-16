import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import getApiError from "../utils/getApiError";

const CATEGORIES = ["Career", "Finance", "Personal", "Health", "Education", "Other"];

const initialForm = {
  title: "",
  description: "",
  category: "Career",
  expectedOutcome: "",
  decisionDate: "",
};

function AddDecision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchDecision = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}`);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "Career",
          expectedOutcome: data.expectedOutcome || "",
          decisionDate: data.decisionDate ? data.decisionDate.split("T")[0] : "",
        });
      } catch (fetchError) {
        setError(getApiError(fetchError, "Failed to load decision"));
      }
    };

    fetchDecision();
  }, [id, isEdit]);

  const onChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required";
    if (formData.title.trim().length < 3) return "Title must be at least 3 characters";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.expectedOutcome.trim()) return "Expected outcome is required";
    if (!formData.decisionDate) return "Decision date is required";
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
        await api.put(`/decisions/${id}`, formData);
      } else {
        await api.post("/decisions", formData);
      }
      navigate("/");
    } catch (submitError) {
      setError(getApiError(submitError, "Failed to save decision"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <h2>{isEdit ? "Update Decision" : "Add Decision"}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={onChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={formData.description}
          onChange={onChange}
        />
        <select name="category" value={formData.category} onChange={onChange}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <textarea
          name="expectedOutcome"
          placeholder="Expected Outcome"
          rows={3}
          value={formData.expectedOutcome}
          onChange={onChange}
        />
        <input
          type="date"
          name="decisionDate"
          value={formData.decisionDate}
          onChange={onChange}
        />

        <div className="row">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Decision"}
          </button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </section>
  );
}

export default AddDecision;
