// src/utils/storage.js
const KEY = 'ea_state_v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveState(partial) {
  try {
    const current = loadState();
    localStorage.setItem(KEY, JSON.stringify({ ...current, ...partial }));
  } catch {
    // no-op
  }
}
