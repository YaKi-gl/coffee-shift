/**
 * Бизнес-логика: показатели кофейни. Чистые функции без DOM — их легко тестировать.
 */
import { WRITEOFF_REASONS } from '../config/constants.js';
import { addDays } from '../utils/date.js';

const sum = (items, key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0);

/** Записи за период (to - days; to], например последние 7 дней. */
export const inPeriod = (items, to, days) => items.filter((x) => x.date > addDays(to, -days) && x.date <= to);

/**
 * Продажи за день = наличные + безнал (до вычета возвратов).
 * Старые записи без разбивки хранят только общую сумму в поле revenue.
 */
export function salesOf(day) {
  const hasSplit = day.cash !== undefined || day.card !== undefined;
  return hasSplit ? (Number(day.cash) || 0) + (Number(day.card) || 0) : Number(day.revenue) || 0;
}

/** Выручка за день = продажи − сумма возвратов. */
export const revenueOf = (day) => salesOf(day) - (Number(day.refundAmount) || 0);

const totalRevenue = (days) => days.reduce((total, d) => total + revenueOf(d), 0);
const totalSales = (days) => days.reduce((total, d) => total + salesOf(d), 0);

export function averageRevenue(days) {
  return days.length ? totalRevenue(days) / days.length : 0;
}

/** Средний чек = продажи / чеки продажи (возвраты учитываются отдельно). */
export function averageCheck(days) {
  const checks = sum(days, 'checks');
  return checks ? totalSales(days) / checks : 0;
}

/** Структура оплат: суммы наличных и безнала и доля безнала в %. */
export function paymentSplit(days) {
  const cash = sum(days, 'cash');
  const card = sum(days, 'card');
  const total = cash + card;
  return { cash, card, cardShare: total ? (card / total) * 100 : 0 };
}

/** Возвраты: количество чеков, сумма, доля от чеков и доля от продаж, %. */
export function refundStats(days) {
  const refunds = sum(days, 'refunds');
  const amount = sum(days, 'refundAmount');
  const checks = sum(days, 'checks');
  const sales = totalSales(days);
  return {
    refunds,
    amount,
    refundRate: checks ? (refunds / checks) * 100 : 0,
    amountRate: sales ? (amount / sales) * 100 : 0,
  };
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
