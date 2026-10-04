/**
 * Вкладка «Смены»: недельный график и форма добавления смены.
 */
import { formatDay, formatWeekday, todayIso, weekDays } from '../utils/date.js';
import { escapeHtml } from '../utils/format.js';

const Shift = (shift) => `
  <div class="shift">
    <div>${escapeHtml(shift.person)}<br><span class="shift__time">${escapeHtml(shift.start)}–${escapeHtml(shift.end)}</span></div>
    <button class="icon-btn" aria-label="Удалить смену" data-action="remove" data-collection="shifts" data-id="${shift.id}">×</button>
  </div>`;

function Day(date, shifts, today) {
  const dayShifts = shifts.filter((s) => s.date === date).sort((a, b) => a.start.localeCompare(b.start));
  return `
    <div class="day ${date === today ? 'day--today' : ''}">
      <h3 class="day__title">${formatWeekday(date)}, ${formatDay(date)}</h3>
      ${dayShifts.map(Shift).join('') || '<span class="muted">Нет смен</span>'}
    </div>`;
}

export function ShiftsView({ shifts }, weekStart) {
  const today = todayIso();
  const days = weekDays(weekStart);

  return `
    <section class="panel">
      <div class="row row--between">
        <h2>График смен</h2>
        <div class="row">
          <button class="btn btn--ghost" data-action="move-week" data-offset="-7" aria-label="Предыдущая неделя">←</button>
          <span class="muted">${formatDay(days[0])} — ${formatDay(days[6])}</span>
          <button class="btn btn--ghost" data-action="move-week" data-offset="7" aria-label="Следующая неделя">→</button>
        </div>
      </div>

      <div class="week">${days.map((d) => Day(d, shifts, today)).join('')}</div>

      <form class="entry-form" data-form="shift">
        <label>Дата<input type="date" id="shift-date" name="date" required value="${today}"></label>
        <label>Сотрудник<input type="text" id="shift-person" name="person" required placeholder="Имя"></label>
        <label>Начало<input type="time" id="shift-start" name="start" required value="07:30"></label>
        <label>Конец<input type="time" id="shift-end" name="end" required value="15:30"></label>
        <button class="btn">Добавить смену</button>
      </form>
    </section>`;
}
