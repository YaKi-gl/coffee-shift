import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { averageCheck, revenueOf } from '../../services/metrics.js';
import { formatDay, formatWeekday, todayIso } from '../../utils/date.js';
import { formatRub } from '../../utils/format.js';
import { rowMotion } from '../motion/rowMotion.js';
import { staggerContainer } from '../motion/presets.js';
import { EmptyState } from '../ui/EmptyState.jsx';
import { EntryForm, Field } from '../ui/EntryForm.jsx';
import { Panel } from '../ui/Panel.jsx';
import { RemoveButton } from '../ui/RemoveButton.jsx';
import './Revenue.css';

const money = (value) => (value === undefined ? '—' : formatRub(Number(value) || 0));

/** Итог дня считается на лету: продажи − возвраты = выручка. */
function LiveTotal({ cash, card, refundAmount }) {
  const sales = (Number(cash) || 0) + (Number(card) || 0);
  const refunds = Number(refundAmount) || 0;
  const total = sales - refunds;
  return (
    <div className="revenue-total" aria-live="polite">
      {refunds > 0 && (
        <span className="revenue-total__formula">
          {formatRub(sales)} − {formatRub(refunds)} =
        </span>
      )}
      <span className="revenue-total__label">Выручка за день</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={total} className="revenue-total__value" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>
          {formatRub(total)}
        </motion.b>
      </AnimatePresence>
    </div>
  );
}

/** Вкладка «Выручка»: наличные, безнал, чеки и возвраты за день. */
export function RevenueView({ days, onSave, onRemove }) {
  const rows = [...days].sort((a, b) => b.date.localeCompare(a.date));
  const [draft, setDraft] = useState({ cash: '', card: '', refundAmount: '' });

  const track = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  function handleSave(values) {
    onSave(values);
    setDraft({ cash: '', card: '', refundAmount: '' });
  }

  return (
    <motion.div variants={staggerContainer()} initial="hidden" animate="show">
      <Panel title="Выручка по дням">
        <EntryForm submitLabel="Сохранить день" onSubmit={handleSave}>
          <Field label="Дата">
            <input type="date" id="rev-date" name="date" required defaultValue={todayIso()} />
          </Field>
          <Field label="Наличные, ₽">
            <input type="number" id="rev-cash" name="cash" min="0" required placeholder="14000" onChange={track('cash')} />
          </Field>
          <Field label="Безнал, ₽">
            <input type="number" id="rev-card" name="card" min="0" required placeholder="28000" onChange={track('card')} />
          </Field>
          <Field label="Чеков продажи">
            <input type="number" id="rev-checks" name="checks" min="0" required placeholder="140" />
          </Field>
          <Field label="Чеков возврата">
            <input type="number" id="rev-refunds" name="refunds" min="0" defaultValue="0" />
          </Field>
          <Field label="Сумма возвратов, ₽">
            <input type="number" id="rev-refund-amount" name="refundAmount" min="0" defaultValue="0" onChange={track('refundAmount')} />
          </Field>
        </EntryForm>
        <div className="row row--between">
          <p className="muted">Наличные и безнал — суммы продаж; возвраты вычитаются из выручки. Повторная запись за ту же дату заменит прежнюю.</p>
          <LiveTotal cash={draft.cash} card={draft.card} refundAmount={draft.refundAmount} />
        </div>

        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th className="num">Наличные</th>
                  <th className="num">Безнал</th>
                  <th className="num">Чеков</th>
                  <th className="num">Возвраты</th>
                  <th className="num">Выручка</th>
                  <th className="num">Средний чек</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((d) => (
                    <motion.tr key={`${d.id}-${revenueOf(d)}-${d.checks}-${d.refunds}-${d.refundAmount}`} {...rowMotion}>
                      <td>
                        {formatWeekday(d.date)}, {formatDay(d.date)} {d.example && <span className="tag">пример</span>}
                      </td>
                      <td className="num">{money(d.cash)}</td>
                      <td className="num">{money(d.card)}</td>
                      <td className="num">{d.checks || 0}</td>
                      <td className={`num ${d.refunds || d.refundAmount ? 'refund-cell' : ''}`}>
                        {d.refunds || d.refundAmount ? `${d.refunds ?? 0} шт · −${formatRub(Number(d.refundAmount) || 0)}` : '—'}
                      </td>
                      <td className="num revenue-cell">{formatRub(revenueOf(d))}</td>
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
