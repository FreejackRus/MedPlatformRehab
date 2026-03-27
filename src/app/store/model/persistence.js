import { createDefaultAppState, STORAGE_KEY } from "./defaultState.js";

export { STORAGE_KEY };

export function loadState() {
  if (typeof window === "undefined") {
    return createDefaultAppState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultAppState();
  }

  try {
    const defaultAppState = createDefaultAppState();
    return { ...defaultAppState, ...JSON.parse(raw) };
  } catch {
    return createDefaultAppState();
  }
}

export function persistState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearPersistedState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
