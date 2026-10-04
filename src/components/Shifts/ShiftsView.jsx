import { AnimatePresence, motion } from 'framer-motion';
import { formatDay, todayIso, weekDays } from '../../utils/date.js';
import { staggerContainer } from '../motion/presets.js';
import { EntryForm, Field } from '../ui/EntryForm.jsx';
import { Panel } from '../ui/Panel.jsx';
import { WeekGrid } from './WeekGrid.jsx';
import './Shifts.css';

/** Вкладка «Смены»: недельный график с перелистыванием и форма добавления. */
export function ShiftsView({ shifts, weekStart, direction, onMoveWeek, onAdd, onRemove }) {
  const days = weekDays(weekStart);

  const navigation = (
    <div className="row">
      <motion.button className="btn btn--ghost" onClick={() => onMoveWeek(-7)} whileTap={{ x: -3 }} aria-label="Предыдущая неделя">
        ←
      </motion.button>
      <span className="muted week-range">
        {formatDay(days[0])} — {formatDay(days[6])}
      </span>
      <motion.button className="btn btn--ghost" onClick={() => onMoveWeek(7)} whileTap={{ x: 3 }} aria-label="Следующая неделя">
        →
      </motion.button>
    </div>
  );

  return (
    <motion.div variants={staggerContainer()} initial="hidden" animate="show">
      <Panel title="График смен" actions={navigation}>
        <div className="week-viewport">
          {/* Неделя уезжает в сторону листания, новая въезжает с противоположной */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <WeekGrid key={weekStart} days={days} shifts={shifts} today={todayIso()} direction={direction} onRemove={onRemove} />
          </AnimatePresence>
        </div>

        <EntryForm submitLabel="Добавить смену" onSubmit={onAdd}>
          <Field label="Дата">
            <input type="date" id="shift-date" name="date" required defaultValue={todayIso()} />
          </Field>
          <Field label="Сотрудник">
            <input type="text" id="shift-person" name="person" required placeholder="Имя" />
          </Field>
          <Field label="Начало">
            <input type="time" id="shift-start" name="start" required defaultValue="07:30" />
          </Field>
          <Field label="Конец">
            <input type="time" id="shift-end" name="end" required defaultValue="15:30" />
          </Field>
        </EntryForm>
      </Panel>
    </motion.div>
  );
}
