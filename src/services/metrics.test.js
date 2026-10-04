import { describe, expect, it } from 'vitest';
import {
  averageCheck,
  averageRevenue,
  inPeriod,
  percentChange,
  shiftsInWeek,
  totalCost,
  weekOverWeek,
  writeoffsByReason,
} from './metrics.js';

const day = (date, revenue, checks) => ({ date, revenue, checks });

describe('выручка и средний чек', () => {
  const days = [day('2026-10-01', 40000, 130), day('2026-10-02', 44000, 145)];

  it('averageRevenue — среднее за день', () => {
    expect(averageRevenue(days)).toBe(42000);
  });

  it('averageCheck — общая выручка / общее число чеков', () => {
    expect(averageCheck(days)).toBeCloseTo(84000 / 275, 4);
  });

  it('пустые данные дают 0, а не NaN', () => {
    expect(averageRevenue([])).toBe(0);
    expect(averageCheck([])).toBe(0);
  });
});

describe('percentChange', () => {
  it('считает изменение в процентах', () => {
    expect(percentChange(110, 100)).toBeCloseTo(10, 6);
  });

  it('возвращает null, если сравнивать не с чем', () => {
    expect(percentChange(100, 0)).toBeNull();
  });
});

describe('weekOverWeek', () => {
  it('сравнивает последние 7 дней с предыдущими 7', () => {
    const days = [];
    for (let i = 1; i <= 14; i++) {
      const date = `2026-10-${String(i).padStart(2, '0')}`;
      days.push(day(date, i <= 7 ? 30000 : 33000, 100));
    }
    const result = weekOverWeek(days, '2026-10-14');
    expect(result.revenue).toBe(33000);
    expect(result.revenueChange).toBeCloseTo(10, 6);
  });
});

describe('списания', () => {
  const writeoffs = [
    { date: '2026-10-01', cost: 300, reason: 'Истёк срок' },
    { date: '2026-10-02', cost: 120, reason: 'Брак / порча' },
    { date: '2026-10-03', cost: 200, reason: 'Истёк срок' },
    { date: '2026-08-01', cost: 999, reason: 'Другое' },
  ];

  it('inPeriod отбрасывает старые записи', () => {
    expect(inPeriod(writeoffs, '2026-10-04', 30)).toHaveLength(3);
  });

  it('totalCost суммирует стоимость', () => {
    expect(totalCost(writeoffs.slice(0, 3))).toBe(620);
  });

  it('writeoffsByReason группирует и сортирует по убыванию', () => {
    expect(writeoffsByReason(writeoffs.slice(0, 3))).toEqual([
      { reason: 'Истёк срок', total: 500 },
      { reason: 'Брак / порча', total: 120 },
    ]);
  });
});

describe('shiftsInWeek', () => {
  it('берёт смены с понедельника по воскресенье', () => {
    const shifts = [{ date: '2026-09-28' }, { date: '2026-10-04' }, { date: '2026-10-05' }];
    expect(shiftsInWeek(shifts, '2026-09-28')).toHaveLength(2);
  });
});
