import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { formatDay, formatWeekday } from '../../utils/date.js';
import { RemoveButton } from '../ui/RemoveButton.jsx';

const slide = {
  enter: (dir) => ({ x: dir >= 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir >= 0 ? -60 : 60, opacity: 0 }),
};

/** Сетка из 7 дней со сменами. forwardRef нужен для AnimatePresence. */
export const WeekGrid = forwardRef(function WeekGrid({ days, shifts, today, direction, onRemove }, ref) {
  return (
    <motion.div
      ref={ref}
      className="week"
      custom={direction}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {days.map((date) => {
        const dayShifts = shifts.filter((s) => s.date === date).sort((a, b) => a.start.localeCompare(b.start));
        return (
          <div key={date} className={`day ${date === today ? 'day--today' : ''}`}>
            <h3 className="day__title">
              {formatWeekday(date)}, {formatDay(date)}
            </h3>
            <AnimatePresence initial={false}>
              {dayShifts.map((shift) => (
                <motion.div
                  key={shift.id}
                  className="shift"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div>
                    {shift.person}
                    <br />
                    <span className="shift__time">
                      {shift.start}–{shift.end}
                    </span>
                  </div>
                  <RemoveButton label="Удалить смену" onClick={() => onRemove('shifts', shift.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
            {!dayShifts.length && <span className="muted">Нет смен</span>}
          </div>
        );
      })}
    </motion.div>
  );
});
