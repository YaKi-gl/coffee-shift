/**
 * Хук-фасад: состояние кофейни, готовые действия и автосохранение данных.
 */
import { useEffect, useMemo, useReducer } from 'react';
import { createSeedData } from '../data/seed.js';
import { loadData, saveData } from '../services/storage.js';
import { ActionTypes as T, createInitialState, shopReducer } from '../store/shopReducer.js';
import { mondayOf, todayIso } from '../utils/date.js';

function init() {
  const today = todayIso();
  return createInitialState(loadData() ?? createSeedData(today), mondayOf(today));
}

export function useCoffeeShop() {
  const [state, dispatch] = useReducer(shopReducer, undefined, init);

  useEffect(() => {
    saveData(state.data);
  }, [state.data]);

  const actions = useMemo(
    () => ({
      setTab: (tab) => dispatch({ type: T.SET_TAB, tab }),
      moveWeek: (days) => dispatch({ type: T.MOVE_WEEK, days }),
      addShift: (shift) => dispatch({ type: T.ADD_SHIFT, shift }),
      addWriteoff: (writeoff) => dispatch({ type: T.ADD_WRITEOFF, writeoff }),
      saveDay: (day) => dispatch({ type: T.SAVE_DAY, day }),
      remove: (collection, id) => dispatch({ type: T.REMOVE, collection, id }),
    }),
    [],
  );

  return { state, actions };
}
