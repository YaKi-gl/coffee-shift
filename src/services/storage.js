/**
 * Слой хранения. Сейчас это localStorage; при переходе на сервер
 * достаточно заменить реализацию этих функций.
 */
import { STORAGE_KEY } from '../config/constants.js';

/** @returns {{days: Array, writeoffs: Array, shifts: Array} | null} */
export function loadData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data?.days && data?.writeoffs && data?.shifts ? data : null;
  } catch {
    return null;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function isStorageAvailable() {
  try {
    const key = `${STORAGE_KEY}:probe`;
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
