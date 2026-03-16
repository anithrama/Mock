import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AddDecision from "./pages/AddDesicion";
import AddOutcome from "./pages/AddOutcome";
import Dashboard from "./pages/Dashboard";
import DecisionDetails from "./pages/DecisionDetails";
import DecisionList from "./pages/DecisionList";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <h1>Decision Journal</h1>
          <p className="subtle">Track decisions, record outcomes, and learn from results.</p>
          <nav className="nav">
            <Link to="/">Decisions</Link>
            <Link to="/decisions/new">Add Decision</Link>
            <Link to="/dashboard">Analytics</Link>
          </nav>
        </header>

        <main className="panel">
          <Routes>
            <Route path="/" element={<DecisionList />} />
            <Route path="/decisions/new" element={<AddDecision />} />
            <Route path="/decisions/:id/edit" element={<AddDecision />} />
            <Route path="/decisions/:id" element={<DecisionDetails />} />
            <Route path="/decisions/:id/outcome" element={<AddOutcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

