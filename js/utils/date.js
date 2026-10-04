/**
 * Работа с датами в формате YYYY-MM-DD (по местному времени, без сдвигов часовых поясов).
 */

const pad = (n) => String(n).padStart(2, '0');

export const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Полдень, чтобы переход на летнее время не сдвигал дату. */
const parse = (iso) => new Date(`${iso}T12:00:00`);

export const todayIso = () => toIso(new Date());

export function addDays(iso, days) {
  const d = parse(iso);
  d.setDate(d.getDate() + days);
  return toIso(d);
}

/** Понедельник недели, в которую входит дата. */
export function mondayOf(iso) {
  const d = parse(iso);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return toIso(d);
}

/** Семь дат недели начиная с понедельника. */
export const weekDays = (monday) => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

/** «8 окт.» */
export const formatDay = (iso) => parse(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

/** «пн» */
export const formatWeekday = (iso) => parse(iso).toLocaleDateString('ru-RU', { weekday: 'short' });
