import { useMemo, useState } from "react";
import { getSettings } from "../Lib/storage";
import { setSupervisorAuthed } from "../Lib/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SupervisorLoginModal({ open, onClose, onSuccess }: Props) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const settings = useMemo(() => getSettings(), []);

  if (!open) return null;

  function submit() {
    if (!pass.trim()) {
      setError("Ingresa la clave.");
      return;
    }
    if (pass.trim() !== settings.supervisorPass) {
      setError("Clave incorrecta.");
      return;
    }
    setSupervisorAuthed(true);
    setError(null);
    setPass("");
    onSuccess();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          background: "#0f1a33",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18 }}>Acceso Supervisor</h3>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Ingresa la clave para ver el dashboard.
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Clave"
            type="password"
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#0b1220",
              color: "#e6e9ef",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") onClose();
            }}
          />

          {error && (
            <div style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,0,0,0.10)" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "transparent",
                color: "#e6e9ef",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#1b2a57",
                color: "#e6e9ef",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Entrar
            </button>
          </div>
        </div>

        <p style={{ marginTop: 12, opacity: 0.6, fontSize: 12 }}>
          v1: clave hardcodeada en settings (después lo migramos a auth real).
        </p>
      </div>
    </div>
  );
}
