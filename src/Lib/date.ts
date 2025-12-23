export function nowISO() {
  return new Date().toISOString();
}

export function todayYMD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ymdFromISO(iso: string) {
  return iso.slice(0, 10);
}

export function hourLabelFromISO(iso: string) {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, "0");
  return `${h}:00`;
}
