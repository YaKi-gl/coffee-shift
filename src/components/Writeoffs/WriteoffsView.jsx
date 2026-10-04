import { AnimatePresence, motion } from 'framer-motion';
import { UNITS, WRITEOFF_REASONS } from '../../config/constants.js';
import { formatDay, todayIso } from '../../utils/date.js';
import { formatRub } from '../../utils/format.js';
import { staggerContainer } from '../motion/presets.js';
import { EmptyState } from '../ui/EmptyState.jsx';
import { EntryForm, Field } from '../ui/EntryForm.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RemoveButton } from '../ui/RemoveButton.jsx';
import { rowMotion } from '../motion/rowMotion.js';

/** Вкладка «Списания»: форма и журнал. Новые строки подсвечиваются при появлении. */
export function WriteoffsView({ writeoffs, onAdd, onRemove }) {
  const rows = [...writeoffs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div variants={staggerContainer()} initial="hidden" animate="show">
      <Panel title="Журнал списаний">
        <EntryForm submitLabel="Списать" onSubmit={onAdd}>
          <Field label="Дата">
            <input type="date" id="wo-date" name="date" required defaultValue={todayIso()} />
          </Field>
          <Field label="Позиция">
            <input type="text" id="wo-item" name="item" required placeholder="Молоко 3,2%" />
          </Field>
          <Field label="Кол-во">
            <input type="number" id="wo-qty" name="qty" min="0" step="0.1" required defaultValue="1" />
          </Field>
          <Field label="Ед.">
            <select id="wo-unit" name="unit">
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Field>
          <Field label="Сумма, ₽">
            <input type="number" id="wo-cost" name="cost" min="0" required />
          </Field>
          <Field label="Причина">
            <select id="wo-reason" name="reason">
              {WRITEOFF_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
        </EntryForm>

        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Позиция</th>
                  <th>Причина</th>
                  <th className="num">Кол-во</th>
                  <th className="num">Сумма</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((w) => (
                    <motion.tr key={w.id} {...rowMotion}>
                      <td>{formatDay(w.date)}</td>
                      <td>
                        {w.item} {w.example && <span className="tag">пример</span>}
                      </td>
                      <td>{w.reason}</td>
                      <td className="num">
                        {w.qty} {w.unit}
                      </td>
                      <td className="num">{formatRub(Number(w.cost) || 0)}</td>
                      <td>
                        <RemoveButton onClick={() => onRemove('writeoffs', w.id)} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState>Списаний пока нет. Заполните форму выше.</EmptyState>
        )}
      </Panel>
    </motion.div>
  );
}
