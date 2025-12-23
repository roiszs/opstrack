const AUTH_KEY = "opstrack_supervisor_auth";

export function isSupervisorAuthed(): boolean {
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setSupervisorAuthed(value: boolean) {
  localStorage.setItem(AUTH_KEY, value ? "1" : "0");
}

export function logoutSupervisor() {
  localStorage.setItem(AUTH_KEY, "0");
}
