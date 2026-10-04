import { AnimatePresence, motion } from 'framer-motion';
import { averageCheck } from '../../services/metrics.js';
import { formatDay, formatWeekday, todayIso } from '../../utils/date.js';
import { formatRub } from '../../utils/format.js';
import { rowMotion } from '../motion/rowMotion.js';
import { staggerContainer } from '../motion/presets.js';
import { EmptyState } from '../ui/EmptyState.jsx';
import { EntryForm, Field } from '../ui/EntryForm.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RemoveButton } from '../ui/RemoveButton.jsx';

/** Вкладка «Выручка»: ввод за день и таблица со средним чеком. */
export function RevenueView({ days, onSave, onRemove }) {
  const rows = [...days].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div variants={staggerContainer()} initial="hidden" animate="show">
      <Panel title="Выручка по дням">
        <EntryForm submitLabel="Сохранить день" onSubmit={onSave}>
          <Field label="Дата">
            <input type="date" id="rev-date" name="date" required defaultValue={todayIso()} />
          </Field>
          <Field label="Выручка, ₽">
            <input type="number" id="rev-amount" name="revenue" min="0" required placeholder="42000" />
          </Field>
          <Field label="Чеков">
            <input type="number" id="rev-checks" name="checks" min="0" required placeholder="140" />
          </Field>
        </EntryForm>
        <p className="muted">Повторная запись за ту же дату заменит прежнюю.</p>

        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th className="num">Выручка</th>
                  <th className="num">Чеков</th>
                  <th className="num">Средний чек</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((d) => (
                    <motion.tr key={`${d.id}-${d.revenue}-${d.checks}`} {...rowMotion}>
                      <td>
                        {formatWeekday(d.date)}, {formatDay(d.date)} {d.example && <span className="tag">пример</span>}
                      </td>
                      <td className="num">{formatRub(d.revenue)}</td>
                      <td className="num">{d.checks || 0}</td>
                      <td className="num">{d.checks ? formatRub(averageCheck([d])) : '—'}</td>
                      <td>
                        <RemoveButton onClick={() => onRemove('days', d.id)} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState>Нет данных о выручке.</EmptyState>
        )}
      </Panel>
    </motion.div>
  );
}
