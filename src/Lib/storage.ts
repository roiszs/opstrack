import type { ProductionRecord, Settings } from "../types/opstrack";

const RECORDS_KEY = "opstrack_records";
const SETTINGS_KEY = "opstrack_settings";

const defaultSettings: Settings = {
  processOptions: ["Vertical Laser 100043667", "Packing", "Inspection", "Rework"],
  supervisorPass: "1234",
  shiftMode: "manual",
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getSettings(): Settings {
  const s = safeParse<Settings>(localStorage.getItem(SETTINGS_KEY), defaultSettings);
  // Asegura defaults si faltan campos (por versiones)
  return {
    processOptions: Array.isArray(s.processOptions) ? s.processOptions : defaultSettings.processOptions,
    supervisorPass: s.supervisorPass ?? defaultSettings.supervisorPass,
    shiftMode: s.shiftMode ?? defaultSettings.shiftMode,
  };
}

export function setSettings(next: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

export function getRecords(): ProductionRecord[] {
  return safeParse<ProductionRecord[]>(localStorage.getItem(RECORDS_KEY), []);
}

export function addRecord(record: ProductionRecord) {
  const prev = getRecords();
  localStorage.setItem(RECORDS_KEY, JSON.stringify([record, ...prev]));
}

export function clearRecords() {
  localStorage.removeItem(RECORDS_KEY);
}
