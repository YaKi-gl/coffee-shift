import { motion } from 'framer-motion';
import { revenueOf } from '../../services/metrics.js';
import { formatDay } from '../../utils/date.js';
import { formatRub } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

const SIZE = { width: 640, height: 240, left: 52, bottom: 28, top: 12, right: 8 };
const STEP = 10000; // шаг округления верхней границы оси, ₽

export function ChartLegend() {
  return (
    <div className="chart-legend">
      <span>
        <i className="chart-legend__dot chart-legend__dot--card" /> Безнал
      </span>
      <span>
        <i className="chart-legend__dot chart-legend__dot--cash" /> Наличные
      </span>
    </div>
  );
}

/**
 * Столбчатый график выручки (SVG): безнал снизу, наличные сверху.
 * Столбцы «вырастают» от оси по очереди. Старые записи без разбивки — одним цветом.
 */
export function RevenueChart({ days }) {
  if (!days.length) return <EmptyState>Добавьте выручку на вкладке «Выручка» — здесь появится график.</EmptyState>;

  const { width, height, left, bottom, top, right } = SIZE;
  const max = Math.ceil(Math.max(...days.map(revenueOf)) / STEP) * STEP || STEP;
  const barWidth = (width - left - right) / days.length;
  const baseline = height - bottom;
  const y = (value) => top + (baseline - top) * (1 - value / max);
  const h = (value) => baseline - y(value);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Выручка по дням: наличные и безнал">
        {[0, max / 2, max].map((v) => (
          <g key={v}>
            <line className="chart__grid" x1={left} x2={width} y1={y(v)} y2={y(v)} />
            <text x={left - 6} y={y(v) + 4} textAnchor="end">
              {v / 1000}k
            </text>
          </g>
        ))}

        {days.map((day, i) => {
          const x = left + i * barWidth + 3;
          const w = barWidth - 6;
          const total = revenueOf(day);
          const hasSplit = day.card !== undefined || day.cash !== undefined;
          const card = hasSplit ? Number(day.card) || 0 : total;
          const transition = { delay: i * 0.035, type: 'spring', stiffness: 140, damping: 18 };

          return (
            <g key={day.date}>
              <title>
                {formatDay(day.date)}: {formatRub(total)}
                {hasSplit ? ` (безнал ${formatRub(card)}, нал ${formatRub(total - card)})` : ''}
              </title>
              {/* Нижний сегмент — безнал */}
              <motion.rect
                className="chart__bar chart__bar--card"
                x={x}
                width={w}
                initial={{ height: 0, attrY: baseline }}
                animate={{ height: h(card), attrY: y(card) }}
                transition={transition}
              />
              {/* Верхний сегмент — наличные, растёт вслед за безналом */}
              {hasSplit && (
                <motion.rect
                  className="chart__bar chart__bar--cash"
                  x={x}
                  width={w}
                  rx={3}
                  initial={{ height: 0, attrY: y(card) }}
                  animate={{ height: h(total - card), attrY: y(total) }}
                  transition={{ ...transition, delay: transition.delay + 0.15 }}
                />
              )}
              {(days.length - 1 - i) % 2 === 0 && (
                <text x={x + w / 2} y={height - 8} textAnchor="middle">
                  {formatDay(day.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
