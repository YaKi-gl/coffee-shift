/**
 * Хранилище состояния (паттерн «store + actions»).
 * Компоненты только читают state; изменения идут через actions,
 * после чего данные сохраняются и подписчики перерисовывают UI.
 */
import { createSeedData } from './data/seed.js';
import { loadData, saveData } from './services/storage.js';
import { addDays, mondayOf, todayIso } from './utils/date.js';
import { createId } from './utils/format.js';

function initialData() {
  const stored = loadData();
  if (stored) return stored;
  const seed = createSeedData(todayIso());
  saveData(seed);
  return seed;
}

export const state = {
  data: initialData(), // { days, writeoffs, shifts }
  tab: 'overview',
  weekStart: mondayOf(todayIso()),
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((listener) => listener(state));
}

/** Изменяет одну коллекцию данных, сохраняет и обновляет UI. */
function updateCollection(name, updater) {
  const data = { ...state.data, [name]: updater(state.data[name]) };
  saveData(data);
  setState({ data });
}

export const actions = {
  setTab(tab) {
    setState({ tab });
  },

  moveWeek(offsetDays) {
    setState({ weekStart: addDays(state.weekStart, offsetDays) });
  },

  addShift({ date, person, start, end }) {
    updateCollection('shifts', (list) => [...list, { id: createId('s'), date, person, start, end }]);
  },

  addWriteoff({ date, item, qty, unit, cost, reason }) {
    updateCollection('writeoffs', (list) => [
      ...list,
      { id: createId('w'), date, item, qty: Number(qty), unit, cost: Number(cost), reason },
    ]);
  },

  /** Выручка хранится одной записью на дату: повторный ввод заменяет прежний. */
  saveDay({ date, revenue, checks }) {
    const day = { id: `day-${date}`, date, revenue: Number(revenue), checks: Number(checks) };
    updateCollection('days', (list) => [...list.filter((d) => d.date !== date), day]);
  },

  remove(collection, id) {
    updateCollection(collection, (list) => list.filter((x) => x.id !== id));
  },
};
