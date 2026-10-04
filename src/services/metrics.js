/**
 * Бизнес-логика: показатели кофейни. Чистые функции без DOM — их легко тестировать.
 */
import { WRITEOFF_REASONS } from '../config/constants.js';
import { addDays } from '../utils/date.js';

const sum = (items, key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0);

/** Записи за период (to - days; to], например последние 7 дней. */
export const inPeriod = (items, to, days) => items.filter((x) => x.date > addDays(to, -days) && x.date <= to);

export function averageRevenue(days) {
  return days.length ? sum(days, 'revenue') / days.length : 0;
}

export function averageCheck(days) {
  const checks = sum(days, 'checks');
  return checks ? sum(days, 'revenue') / checks : 0;
}

/** Изменение в процентах; null, если сравнивать не с чем. */
export function percentChange(current, previous) {
  return previous ? ((current - previous) / previous) * 100 : null;
}

/** Сравнение последней недели с предыдущей по выручке и среднему чеку. */
export function weekOverWeek(days, today) {
  const current = inPeriod(days, today, 7);
  const previous = inPeriod(days, addDays(today, -7), 7);
  const revenue = averageRevenue(current);
  const check = averageCheck(current);
  return {
    revenue,
    revenueChange: percentChange(revenue, averageRevenue(previous)),
    check,
    checkChange: percentChange(check, averageCheck(previous)),
  };
}

export const totalCost = (writeoffs) => sum(writeoffs, 'cost');

/** Сумма списаний по каждой причине, по убыванию, без нулевых. */
export function writeoffsByReason(writeoffs) {
  return WRITEOFF_REASONS.map((reason) => ({
    reason,
    total: totalCost(writeoffs.filter((w) => w.reason === reason)),
  }))
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);
}

export const shiftsInWeek = (shifts, monday) => shifts.filter((s) => s.date >= monday && s.date < addDays(monday, 7));

export const uniqueStaff = (shifts) => new Set(shifts.map((s) => s.person)).size;
