import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { getRecords } from "../Lib/storage";
import { isSupervisorAuthed, logoutSupervisor } from "../Lib/auth";
import { todayYMD, ymdFromISO } from "../Lib/date";

export default function SupervisorPage() {
  const authed = isSupervisorAuthed();
  const records = useMemo(() => getRecords(), []);

  if (!authed) return <Navigate to="/" replace />;

  const today = todayYMD();
  const todayRecords = records.filter((r) => ymdFromISO(r.createdAt) === today);

  const totalPieces = todayRecords.reduce((acc, r) => acc + r.pieces, 0);
  const uniqueOperators = new Set(todayRecords.map((r) => r.operatorName)).size;

  // Top operador (hoy)
  const byOperator = new Map<string, number>();
  for (const r of todayRecords) {
    byOperator.set(r.operatorName, (byOperator.get(r.operatorName) ?? 0) + r.pieces);
  }
  const top = [...byOperator.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section
        style={{
          background: "#0f1a33",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 16,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Dashboard Supervisor</h2>
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Métricas rápidas del día: <b>{today}</b>
          </p>
        </div>

        <button
          onClick={() => logoutSupervisor()}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "transparent",
            color: "#e6e9ef",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Cerrar sesión
        </button>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <KPI title="Producción total (hoy)" value={String(totalPieces)} />
        <KPI title="Registros capturados" value={String(todayRecords.length)} />
        <KPI title="Operadores activos" value={String(uniqueOperators)} />
        <KPI title="Top operador (hoy)" value={top ? `${top[0]} · ${top[1]}` : "—"} />
      </section>

      <section
        style={{
          background: "#0f1a33",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>Histórico (hoy)</h3>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          En v2 agregamos filtros por turno, rango de fechas y exportación a Excel.
        </p>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ textAlign: "left", opacity: 0.85 }}>
                <th style={th}>Hora</th>
                <th style={th}>Turno</th>
                <th style={th}>Operador</th>
                <th style={th}># Reloj</th>
                <th style={th}>Proceso</th>
                <th style={th}>Piezas</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={td}>{new Date(r.createdAt).toLocaleTimeString()}</td>
                  <td style={td}>{r.shift}</td>
                  <td style={td}>{r.operatorName}</td>
                  <td style={td}>{r.clockNumber}</td>
                  <td style={td}>{r.process}</td>
                  <td style={{ ...td, fontWeight: 800 }}>{r.pieces}</td>
                </tr>
              ))}
              {todayRecords.length === 0 && (
                <tr>
                  <td style={{ ...td, opacity: 0.7 }} colSpan={6}>
                    No hay registros hoy todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#0f1a33",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 8px" };
const td: React.CSSProperties = { padding: "10px 8px" };
