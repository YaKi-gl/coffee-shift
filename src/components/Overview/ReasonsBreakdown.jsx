import { motion } from 'framer-motion';
import { formatRub } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';

/** Списания по причинам: полосы заполняются по очереди. */
export function ReasonsBreakdown({ rows }) {
  if (!rows.length) return <EmptyState>За период списаний нет.</EmptyState>;

  const max = Math.max(...rows.map((r) => r.total));
  return (
    <div className="reasons">
      {rows.map((row, i) => (
        <div key={row.reason} className="reason">
          <span>{row.reason}</span>
          <span className="reason__sum">{formatRub(row.total)}</span>
          <div className="reason__bar">
            <motion.i
              className="reason__fill"
              initial={{ width: 0 }}
              animate={{ width: `${(row.total / max) * 100}%` }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
