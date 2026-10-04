/**
 * Вкладка «Выручка»: ввод выручки за день и таблица со средним чеком.
 */
import { averageCheck } from '../services/metrics.js';
import { formatDay, formatWeekday, todayIso } from '../utils/date.js';
import { formatRub } from '../utils/format.js';

const Row = (d) => `
  <tr>
    <td>${formatWeekday(d.date)}, ${formatDay(d.date)} ${d.example ? '<span class="tag">пример</span>' : ''}</td>
    <td class="num">${formatRub(d.revenue)}</td>
    <td class="num">${d.checks || 0}</td>
    <td class="num">${d.checks ? formatRub(averageCheck([d])) : '—'}</td>
    <td><button class="icon-btn" aria-label="Удалить" data-action="remove" data-collection="days" data-id="${d.id}">×</button></td>
  </tr>`;

export function RevenueView({ days }) {
  const rows = [...days].sort((a, b) => b.date.localeCompare(a.date));

  const table = rows.length
    ? `<div class="table-wrap"><table>
         <thead><tr><th>Дата</th><th class="num">Выручка</th><th class="num">Чеков</th><th class="num">Средний чек</th><th></th></tr></thead>
         <tbody>${rows.map(Row).join('')}</tbody>
       </table></div>`
    : '<div class="empty">Нет данных о выручке.</div>';

  return `
    <section class="panel">
      <h2>Выручка по дням</h2>
      <form class="entry-form" data-form="day">
        <label>Дата<input type="date" id="rev-date" name="date" required value="${todayIso()}"></label>
        <label>Выручка, ₽<input type="number" id="rev-amount" name="revenue" min="0" required placeholder="42000"></label>
        <label>Чеков<input type="number" id="rev-checks" name="checks" min="0" required placeholder="140"></label>
        <button class="btn">Сохранить день</button>
      </form>
      <p class="muted">Повторная запись за ту же дату заменит прежнюю.</p>
      ${table}
    </section>`;
}
