import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecord, getSettings } from "../Lib/storage";
import { nowISO } from "../Lib/date";
import type { ProductionRecord, Shift } from "../types/opstrack";
import SupervisorLoginModal from "../components/SupervisorLoginModal";

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const settings = useMemo(() => getSettings(), []);

  const [operatorName, setOperatorName] = useState("");
  const [clockNumber, setClockNumber] = useState("");
  const [process, setProcess] = useState(settings.processOptions[0] ?? "");
  const [pieces, setPieces] = useState<number>(0);
  const [shift, setShift] = useState<Shift>("A");
  const [ack, setAck] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [showSupervisorLogin, setShowSupervisorLogin] = useState(false);

  function validate(): string | null {
    if (!operatorName.trim()) return "Falta el nombre del operador.";
    if (!clockNumber.trim()) return "Falta el número de reloj.";
    if (!process.trim()) return "Selecciona el proceso/línea.";
    if (!Number.isFinite(pieces) || pieces <= 0) return "Piezas debe ser mayor a 0.";
    if (!ack) return "Debes confirmar la validación (firma simple).";
    return null;
  }

  function resetForm() {
    setOperatorName("");
    setClockNumber("");
    setPieces(0);
    setAck(false);
    // mantén proceso y turno para rapidez en piso
  }

  function submit() {
    const err = validate();
    if (err) {
      setToast(err);
      return;
    }

    const record: ProductionRecord = {
      id: uid(),
      createdAt: nowISO(),
      shift,
      operatorName: operatorName.trim(),
      clockNumber: clockNumber.trim(),
      process,
      pieces: Number(pieces),
      signature: { type: "checkbox", acknowledged: true },
    };

    addRecord(record);
    setToast("Registro guardado correctamente.");
    resetForm();

    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section
        style={{
          background: "#0f1a33",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Registro de Producción</h2>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Captura rápida para piso de producción (tablet-friendly).
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Turno</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["A", "B", "C"] as Shift[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShift(s)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: shift === s ? "#1b2a57" : "transparent",
                    color: "#e6e9ef",
                    cursor: "pointer",
                    fontWeight: 700,
                    minWidth: 52,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Nombre del operador</label>
            <input
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="Ej. Joel Rodríguez"
              style={{
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#0b1220",
                color: "#e6e9ef",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Número de reloj</label>
            <input
              value={clockNumber}
              onChange={(e) => setClockNumber(e.target.value)}
              placeholder="Ej. 104233"
              inputMode="numeric"
              style={{
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#0b1220",
                color: "#e6e9ef",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Proceso / Línea</label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              style={{
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#0b1220",
                color: "#e6e9ef",
                outline: "none",
              }}
            >
              {settings.processOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Piezas producidas</label>
            <input
              value={String(pieces)}
              onChange={(e) => setPieces(Number(e.target.value))}
              type="number"
              min={0}
              style={{
                padding: "14px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#0b1220",
                color: "#e6e9ef",
                outline: "none",
                fontSize: 18,
                fontWeight: 800,
              }}
            />
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 2 }}>
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            <span style={{ opacity: 0.9 }}>Confirmo que la información es correcta (firma simple).</span>
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <button
              onClick={submit}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#1b2a57",
                color: "#e6e9ef",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              Guardar registro
            </button>

            <button
              onClick={() => setShowSupervisorLogin(true)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "transparent",
                color: "#e6e9ef",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Ir a Supervisor
            </button>
          </div>
        </div>
      </section>

      {toast && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {toast}
        </div>
      )}

      <SupervisorLoginModal
        open={showSupervisorLogin}
        onClose={() => setShowSupervisorLogin(false)}
        onSuccess={() => {
          setShowSupervisorLogin(false);
          navigate("/supervisor");
        }}
      />
    </div>
  );
}
