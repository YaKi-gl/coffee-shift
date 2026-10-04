import { motion } from 'framer-motion';
import { formatDay } from '../../utils/date.js';
import { formatRub } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

const SIZE = { width: 640, height: 240, left: 52, bottom: 28, top: 12, right: 8 };
const STEP = 10000; // шаг округления верхней границы оси, ₽

/** Столбчатый график выручки (SVG). Столбцы «вырастают» снизу по очереди. */
export function RevenueChart({ days }) {
  if (!days.length) return <EmptyState>Добавьте выручку на вкладке «Выручка» — здесь появится график.</EmptyState>;

  const { width, height, left, bottom, top, right } = SIZE;
  const max = Math.ceil(Math.max(...days.map((d) => d.revenue)) / STEP) * STEP || STEP;
  const barWidth = (width - left - right) / days.length;
  const baseline = height - bottom;
  const y = (value) => top + (baseline - top) * (1 - value / max);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Выручка по дням">
        {[0, max / 2, max].map((v) => (
          <g key={v}>
            <line className="chart__grid" x1={left} x2={width} y1={y(v)} y2={y(v)} />
            <text x={left - 6} y={y(v) + 4} textAnchor="end">
              {v / 1000}k
            </text>
          </g>
        ))}

        {days.map((day, i) => {
          const isLast = i === days.length - 1;
          const x = left + i * barWidth;
          const barHeight = baseline - y(day.revenue);
          return (
            <g key={day.date}>
              <motion.rect
                className={`chart__bar ${isLast ? 'chart__bar--last' : ''}`}
                x={x + 3}
                width={barWidth - 6}
                rx={3}
                initial={{ height: 0, attrY: baseline }}
                animate={{ height: barHeight, attrY: y(day.revenue) }}
                transition={{ delay: i * 0.035, type: 'spring', stiffness: 140, damping: 18 }}
              >
                <title>
                  {formatDay(day.date)}: {formatRub(day.revenue)}
                </title>
              </motion.rect>
              {(days.length - 1 - i) % 2 === 0 && (
                <text x={x + barWidth / 2} y={height - 8} textAnchor="middle">
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
