import React from "react";

function DeveloperHub() {
  const sections = [
    {
      title: "Why ApexVest? (Business Value)",
      content: "Traditional trading apps function as simple transaction logs. ApexVest redefines this by integrating AI insights and risk assessment gauges to help retail investors make data-driven, risk-aware decisions."
    },
    {
      title: "System Architecture Overview",
      content: "The system is built on a decoupled MERN stack: client applications authenticate sessions using HttpOnly JWT cookies. High-frequency queries (e.g. stock sentiment and risk scores) utilize structured, cacheable backend services to minimize database roundtrips."
    },
    {
      title: "Database Modeling choices",
      content: "Mongoose holds collection schemas for Users, Holdings, Positions, Orders, and Goals. Tying assets to unique User IDs isolates sessions, while default global null-user mock models provide default starter data for first-time recruiters."
    }
  ];


  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "900px" }}>
      {/* Hero Header */}
      <div className="text-center mb-5">
        <span className="badge bg-indigo-subtle text-indigo p-2 mb-2" style={{ color: "#6366F1", backgroundColor: "rgba(99, 102, 241, 0.1)" }}>Developer Portal</span>
        <h1 className="display-4 fw-bold" style={{ color: "#111827" }}>Technical System Design</h1>
        <p className="lead text-muted">A detailed overview of the design patterns, architectural choices, and interview talking points.</p>
      </div>

      {/* Highlights Grid */}
      <div className="row g-4 mb-5">
        {sections.map((sec, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card h-100 border-0 p-4 shadow-sm" style={{ backgroundColor: "#F9FAFB", borderRadius: "12px" }}>
              <h5 className="fw-bold mb-3" style={{ color: "#111827" }}>{sec.title}</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>{sec.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* System Architecture Diagram (CSS styling mockup representation) */}
      <div className="card border-0 shadow-sm p-4 mb-5" style={{ backgroundColor: "#151E33", color: "#F3F4F6", borderRadius: "16px" }}>
        <h4 className="fw-bold mb-4" style={{ color: "#FFFFFF" }}>High-Level Technical Architecture Flow</h4>
        
        <div className="row text-center align-items-center g-3">
          <div className="col-sm-3">
            <div className="p-3 border rounded border-secondary bg-dark-subtle">
              <h6 className="mb-1 text-info">Client Tier</h6>
              <small className="text-muted">React.js Dashboard</small>
            </div>
          </div>
          <div className="col-sm-1">
            <span className="fs-3 text-muted">→</span>
          </div>
          <div className="col-sm-4">
            <div className="p-3 border rounded border-secondary bg-dark-subtle">
              <h6 className="mb-1 text-warning">API Gateway / Server</h6>
              <small className="text-muted">Express Node.js REST (JWT Auth)</small>
            </div>
          </div>
          <div className="col-sm-1">
            <span className="fs-3 text-muted">→</span>
          </div>
          <div className="col-sm-3">
            <div className="p-3 border rounded border-secondary bg-dark-subtle">
              <h6 className="mb-1 text-success">Database Tier</h6>
              <small className="text-muted">MongoDB Atlas</small>
            </div>
          </div>
        </div>

        <div className="mt-4 border-top border-secondary pt-3">
          <h6 className="text-warning mb-2">Key Implementation Highlights:</h6>
          <ul className="text-muted small mb-0 ps-3">
            <li>State management via React Context API, enforcing single-source-of-truth updates across dashboard pages.</li>
            <li>Role-Based Access Control (RBAC) middleware verifying JWT tokens directly from client-side cookies.</li>
            <li>Lazy loading components using React.lazy and Suspense for optimized frontend loading performance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeveloperHub;
