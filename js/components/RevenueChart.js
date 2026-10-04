/**
 * Столбчатый график выручки по дням (SVG без библиотек).
 * Последний день выделен цветом акцента.
 */
import { formatDay } from '../utils/date.js';
import { formatRub } from '../utils/format.js';

const SIZE = { width: 640, height: 240, left: 52, bottom: 28, top: 12, right: 8 };
const STEP = 10000; // шаг округления верхней границы оси, ₽

export function RevenueChart(days) {
  if (!days.length) {
    return '<div class="empty">Добавьте выручку на вкладке «Выручка» — здесь появится график.</div>';
  }

  const { width, height, left, bottom, top, right } = SIZE;
  const max = Math.ceil(Math.max(...days.map((d) => d.revenue)) / STEP) * STEP || STEP;
  const barWidth = (width - left - right) / days.length;
  const y = (value) => top + (height - top - bottom) * (1 - value / max);

  const gridLines = [0, max / 2, max]
    .map(
      (v) => `
      <line class="chart__grid" x1="${left}" x2="${width}" y1="${y(v)}" y2="${y(v)}"/>
      <text x="${left - 6}" y="${y(v) + 4}" text-anchor="end">${v / 1000}k</text>`,
    )
    .join('');

  const bars = days
    .map((day, i) => {
      const isLast = i === days.length - 1;
      const x = left + i * barWidth;
      // Подписываем каждый второй день, последний — всегда
      const showLabel = (days.length - 1 - i) % 2 === 0;
      return `
        <rect class="chart__bar ${isLast ? 'chart__bar--last' : ''}"
              x="${x + 3}" y="${y(day.revenue)}" width="${barWidth - 6}"
              height="${height - bottom - y(day.revenue)}" rx="3">
          <title>${formatDay(day.date)}: ${formatRub(day.revenue)}</title>
        </rect>
        ${showLabel ? `<text x="${x + barWidth / 2}" y="${height - 8}" text-anchor="middle">${formatDay(day.date)}</text>` : ''}`;
    })
    .join('');

  return `
    <div class="chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Выручка по дням">${gridLines}${bars}</svg>
    </div>`;
}
