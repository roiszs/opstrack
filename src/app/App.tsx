import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const isSupervisor = location.pathname.startsWith("/supervisor");

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e6e9ef" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(11,18,32,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontWeight: 800, letterSpacing: 0.4 }}>OpsTrack</span>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Production Metrics Dashboard</span>
          </div>

          <nav style={{ display: "flex", gap: 10 }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#e6e9ef",
                opacity: isSupervisor ? 0.75 : 1,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              Registro
            </Link>

            <Link
              to="/supervisor"
              style={{
                textDecoration: "none",
                color: "#e6e9ef",
                opacity: isSupervisor ? 1 : 0.75,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              Supervisor
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px" }}>
        <Outlet />
      </main>

      <footer style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", opacity: 0.6 }}>
        v1 (localStorage) · React + TS + Vite
      </footer>
    </div>
  );
}
