import { describe, expect, it } from 'vitest';
import { ActionTypes as T, createInitialState, shopReducer } from './shopReducer.js';

const empty = () => createInitialState({ days: [], writeoffs: [], shifts: [] }, '2026-09-28');

describe('shopReducer', () => {
  it('переключает вкладку', () => {
    expect(shopReducer(empty(), { type: T.SET_TAB, tab: 'shifts' }).tab).toBe('shifts');
  });

  it('листает недели и запоминает направление', () => {
    const state = shopReducer(empty(), { type: T.MOVE_WEEK, days: 7 });
    expect(state.weekStart).toBe('2026-10-05');
    expect(state.weekDirection).toBe(1);
  });

  it('добавляет списание и приводит числа к Number', () => {
    const writeoff = { date: '2026-10-01', item: 'Молоко', qty: '2', unit: 'л', cost: '360', reason: 'Истёк срок' };
    const state = shopReducer(empty(), { type: T.ADD_WRITEOFF, writeoff });
    expect(state.data.writeoffs[0].cost).toBe(360);
    expect(state.data.writeoffs[0].qty).toBe(2);
  });

  it('выручка = наличные + безнал − сумма возвратов', () => {
    const state = shopReducer(empty(), {
      type: T.SAVE_DAY,
      day: { date: '2026-10-01', cash: '15000', card: '27000', checks: '140', refunds: '2', refundAmount: '560' },
    });
    const day = state.data.days[0];
    expect(day.revenue).toBe(41440);
    expect(day.refundAmount).toBe(560);
    expect(day.cash).toBe(15000);
    expect(day.card).toBe(27000);
    expect(day.refunds).toBe(2);
  });

  it('выручка за одну дату перезаписывается', () => {
    let state = shopReducer(empty(), { type: T.SAVE_DAY, day: { date: '2026-10-01', cash: '10000', card: '30000', checks: '130' } });
    state = shopReducer(state, { type: T.SAVE_DAY, day: { date: '2026-10-01', cash: '12000', card: '30000', checks: '140' } });
    expect(state.data.days).toHaveLength(1);
    expect(state.data.days[0].revenue).toBe(42000);
    expect(state.data.days[0].refunds).toBe(0);
  });

  it('удаляет запись из нужной коллекции', () => {
    let state = shopReducer(empty(), { type: T.ADD_SHIFT, shift: { date: '2026-10-01', person: 'Аня', start: '08:00', end: '16:00' } });
    const id = state.data.shifts[0].id;
    state = shopReducer(state, { type: T.REMOVE, collection: 'shifts', id });
    expect(state.data.shifts).toHaveLength(0);
  });
});
