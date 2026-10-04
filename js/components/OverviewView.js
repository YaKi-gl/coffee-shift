/**
 * Вкладка «Обзор»: KPI, график выручки, списания по причинам.
 */
import { CHART_DAYS, WRITEOFF_PERIOD_DAYS } from '../config.js';
import {
  inPeriod,
  shiftsInWeek,
  totalCost,
  uniqueStaff,
  weekOverWeek,
  writeoffsByReason,
} from '../services/metrics.js';
import { mondayOf, todayIso } from '../utils/date.js';
import { formatRub } from '../utils/format.js';
import { Kpi, changeHint } from './Kpi.js';
import { ReasonsBreakdown } from './ReasonsBreakdown.js';
import { RevenueChart } from './RevenueChart.js';

export function OverviewView({ days, writeoffs, shifts }) {
  const today = todayIso();
  const week = weekOverWeek(days, today);
  const recentWriteoffs = inPeriod(writeoffs, today, WRITEOFF_PERIOD_DAYS);
  const thisWeekShifts = shiftsInWeek(shifts, mondayOf(today));
  const chartDays = [...days].sort((a, b) => a.date.localeCompare(b.date)).slice(-CHART_DAYS);

  return `
    <section class="kpis">
      ${Kpi({ label: 'Средняя выручка / день', value: formatRub(week.revenue), hint: changeHint(week.revenueChange) })}
      ${Kpi({ label: 'Средний чек', value: formatRub(week.check), hint: changeHint(week.checkChange) })}
      ${Kpi({
        label: `Списания за ${WRITEOFF_PERIOD_DAYS} дней`,
        value: formatRub(totalCost(recentWriteoffs)),
        hint: `<small class="kpi__hint">${recentWriteoffs.length} позиций</small>`,
      })}
      ${Kpi({
        label: 'Смен на этой неделе',
        value: thisWeekShifts.length,
        hint: `<small class="kpi__hint">сотрудников в графике: ${uniqueStaff(thisWeekShifts)}</small>`,
      })}
    </section>

    <div class="split">
      <section class="panel">
        <h2>Выручка за ${CHART_DAYS} дней</h2>
        ${RevenueChart(chartDays)}
      </section>
      <section class="panel">
        <h2>Списания по причинам</h2>
        ${ReasonsBreakdown(writeoffsByReason(recentWriteoffs))}
      </section>
    </div>`;
}
