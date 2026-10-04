import { motion } from 'framer-motion';
import { CHART_DAYS, WRITEOFF_PERIOD_DAYS } from '../../config/constants.js';
import { inPeriod, paymentSplit, refundStats, shiftsInWeek, totalCost, uniqueStaff, weekOverWeek, writeoffsByReason } from '../../services/metrics.js';
import { mondayOf, todayIso } from '../../utils/date.js';
import { formatRub, formatRubCompact } from '../../utils/format.js';
import { staggerContainer } from '../motion/presets.js';
import { Panel } from '../ui/Panel.jsx';
import { KpiCard } from './KpiCard.jsx';
import { ReasonsBreakdown } from './ReasonsBreakdown.jsx';
import { ChartLegend, RevenueChart } from './RevenueChart.jsx';
import './Overview.css';

/** Вкладка «Обзор»: показатели, график выручки, причины списаний. */
export function OverviewView({ data }) {
  const today = todayIso();
  const week = weekOverWeek(data.days, today);
  const lastWeekDays = inPeriod(data.days, today, 7);
  const split = paymentSplit(lastWeekDays);
  const refunds = refundStats(lastWeekDays);
  const recentWriteoffs = inPeriod(data.writeoffs, today, WRITEOFF_PERIOD_DAYS);
  const thisWeekShifts = shiftsInWeek(data.shifts, mondayOf(today));
  const chartDays = [...data.days].sort((a, b) => a.date.localeCompare(b.date)).slice(-CHART_DAYS);

  return (
    <motion.div className="overview" variants={staggerContainer(0.06)} initial="hidden" animate="show">
      <motion.section className="kpis" variants={staggerContainer(0.06)}>
        <KpiCard label="Средняя выручка / день" value={week.revenue} format={formatRub} change={week.revenueChange} />
        <KpiCard label="Средний чек" value={week.check} format={formatRub} change={week.checkChange} />
        <KpiCard
          label="Безнал за 7 дней"
          value={split.cardShare}
          format={(v) => `${Math.round(v)}%`}
          hint={`нал ${formatRubCompact(split.cash)} · безнал ${formatRubCompact(split.card)}`}
        />
        <KpiCard
          label="Возвраты за 7 дней"
          value={refunds.amount}
          format={formatRub}
          hint={`${refunds.refunds} чеков · ${refunds.amountRate.toFixed(1)}% от продаж`}
        />
        <KpiCard
          label={`Списания за ${WRITEOFF_PERIOD_DAYS} дней`}
          value={totalCost(recentWriteoffs)}
          format={formatRub}
          hint={`${recentWriteoffs.length} позиций`}
        />
        <KpiCard
          label="Смен на этой неделе"
          value={thisWeekShifts.length}
          hint={`сотрудников в графике: ${uniqueStaff(thisWeekShifts)}`}
        />
      </motion.section>

      <div className="split">
        <Panel title={`Выручка за ${CHART_DAYS} дней`} actions={<ChartLegend />}>
          <RevenueChart days={chartDays} />
        </Panel>
        <Panel title="Списания по причинам">
          <ReasonsBreakdown rows={writeoffsByReason(recentWriteoffs)} />
        </Panel>
      </div>
    </motion.div>
  );
}
