export type Shift = "A" | "B" | "C";

export type Signature =
  | { type: "checkbox"; acknowledged: boolean; value?: string }
  | { type: "typed"; acknowledged: boolean; value: string };

export type ProductionRecord = {
  id: string;
  createdAt: string; // ISO
  shift: Shift;
  operatorName: string;
  clockNumber: string;
  process: string;
  pieces: number;
  signature: Signature;
};

export type Settings = {
  processOptions: string[];
  supervisorPass: string; // v1 plain (luego hash)
  shiftMode: "manual" | "autoByTime";
};
