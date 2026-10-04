/**
 * Демо-данные за последние две недели: выручка, списания и смены текущей недели.
 * Генерируются относительно сегодняшней даты, чтобы демо всегда выглядело «живым».
 */
import { WRITEOFF_REASONS } from '../config/constants.js';
import { addDays, mondayOf, weekDays } from '../utils/date.js';

const STAFF = ['Аня', 'Илья', 'Катя'];

const WRITEOFF_SAMPLES = [
  { item: 'Молоко 3,2%', qty: 2, unit: 'л', price: 180, reason: 0 },
  { item: 'Круассаны', qty: 4, unit: 'шт', price: 95, reason: 0 },
  { item: 'Сироп карамель', qty: 1, unit: 'шт', price: 420, reason: 1 },
  { item: 'Латте (переделка)', qty: 2, unit: 'шт', price: 110, reason: 2 },
  { item: 'Эспрессо (проработка)', qty: 3, unit: 'шт', price: 40, reason: 3 },
  { item: 'Чизкейк', qty: 1, unit: 'шт', price: 210, reason: 0 },
];

function seedRevenue(today) {
  return Array.from({ length: 14 }, (_, i) => {
    const daysAgo = 13 - i;
    const date = addDays(today, -daysAgo);
    // Плавный рост выручки и среднего чека + детерминированный «шум»
    const revenue = 36000 + i * 600 + ((daysAgo * 7919) % 5000);
    const checks = Math.round(revenue / (280 + i * 2.3));
    return { id: `day-${date}`, date, revenue, checks, example: true };
  });
}

function seedWriteoffs(today) {
  return WRITEOFF_SAMPLES.map((s, i) => ({
    id: `seed-w${i}`,
    date: addDays(today, -i * 2),
    item: s.item,
    qty: s.qty,
    unit: s.unit,
    cost: s.qty * s.price,
    reason: WRITEOFF_REASONS[s.reason],
    example: true,
  }));
}

function seedShifts(today) {
  return weekDays(mondayOf(today)).flatMap((date, i) => [
    { id: `seed-s${i}a`, date, person: STAFF[i % 3], start: '07:30', end: '15:30', example: true },
    { id: `seed-s${i}b`, date, person: STAFF[(i + 1) % 3], start: '14:30', end: '22:00', example: true },
  ]);
}

export function createSeedData(today) {
  return {
    days: seedRevenue(today),
    writeoffs: seedWriteoffs(today),
    shifts: seedShifts(today),
  };
}
