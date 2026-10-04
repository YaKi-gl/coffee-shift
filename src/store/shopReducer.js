/**
 * Редьюсер состояния кофейни: вкладки, неделя графика и три коллекции данных.
 */
import { addDays } from '../utils/date.js';
import { createId } from '../utils/format.js';

export const ActionTypes = {
  SET_TAB: 'SET_TAB',
  MOVE_WEEK: 'MOVE_WEEK',
  ADD_SHIFT: 'ADD_SHIFT',
  ADD_WRITEOFF: 'ADD_WRITEOFF',
  SAVE_DAY: 'SAVE_DAY',
  REMOVE: 'REMOVE',
};

export const createInitialState = (data, weekStart) => ({ data, tab: 'overview', weekStart, weekDirection: 0 });

const withCollection = (state, name, updater) => ({
  ...state,
  data: { ...state.data, [name]: updater(state.data[name]) },
});

export function shopReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_TAB:
      return { ...state, tab: action.tab };

    case ActionTypes.MOVE_WEEK:
      return { ...state, weekStart: addDays(state.weekStart, action.days), weekDirection: Math.sign(action.days) };

    case ActionTypes.ADD_SHIFT: {
      const { date, person, start, end } = action.shift;
      return withCollection(state, 'shifts', (list) => [...list, { id: createId('s'), date, person, start, end }]);
    }

    case ActionTypes.ADD_WRITEOFF: {
      const { date, item, qty, unit, cost, reason } = action.writeoff;
      const record = { id: createId('w'), date, item, qty: Number(qty), unit, cost: Number(cost), reason };
      return withCollection(state, 'writeoffs', (list) => [...list, record]);
    }

    // Выручка хранится одной записью на дату: повторный ввод заменяет прежний
    case ActionTypes.SAVE_DAY: {
      const { date } = action.day;
      const cash = Number(action.day.cash) || 0;
      const card = Number(action.day.card) || 0;
      const refundAmount = Number(action.day.refundAmount) || 0;
      const day = {
        id: `day-${date}`,
        date,
        cash,
        card,
        revenue: cash + card - refundAmount, // выручка за вычетом возвратов
        checks: Number(action.day.checks) || 0,
        refunds: Number(action.day.refunds) || 0,
        refundAmount,
      };
      return withCollection(state, 'days', (list) => [...list.filter((d) => d.date !== date), day]);
    }

    case ActionTypes.REMOVE:
      return withCollection(state, action.collection, (list) => list.filter((x) => x.id !== action.id));

    default:
      return state;
  }
}
