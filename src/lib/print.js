import { fmtLong, fmtDay, fmtTime, calcEndTime, fmtDuration, todayStr } from './utils';

export function printDailyRunSheet(jobs, dateStr, userName) {
  const date    = dateStr || todayStr();
  const dayJobs = jobs
    .filter(j => j.next === date)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Run Sheet — ${fmtLong(date)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a1a; padding: 32px; }
  .header { border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .brand { font-size: 22px; font-weight: 700; color: #2563eb; }
  .date-big { font-size: 16px; font-weight: 600; text-align: right; }
  .date-sub { font-size: 12px; color: #6b7280; margin-top: 2px; text-align: right; }
  .summary { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 16px; margin-bottom: 20px; font-size: 13px; color: #1e40af; }
  .job { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 14px; page-break-inside: avoid; }
  .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .job-name { font-size: 16px; font-weight: 700; }
  .job-freq { font-size: 11px; background: #eff6ff; color: #1e40af; padding: 2px 9px; border-radius: 12px; font-weight: 500; }
  .time-block { display: flex; align-items: center; gap: 10px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; }
  .time-col { text-align: center; min-width: 60px; }
  .time-lbl { font-size: 10px; font-weight: 600; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
  .time-val { font-size: 17px; font-weight: 700; color: #0c4a6e; }
  .time-bar { flex: 1; height: 4px; background: #7dd3fc; border-radius: 2px; }
  .time-dur { font-size: 12px; color: #0284c7; font-weight: 500; text-align: center; margin-top: 3px; }
  .job-row { display: flex; gap: 6px; margin-bottom: 5px; font-size: 12px; }
  .job-label { color: #6b7280; font-weight: 500; min-width: 60px; }
  .notes-label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 10px 0 5px; }
  .notes { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; font-size: 12px; line-height: 1.7; white-space: pre-wrap; }
  .checks { display: flex; align-items: center; gap: 16px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e5e7eb; font-size: 12px; color: #6b7280; }
  .box { width: 15px; height: 15px; border: 1.5px solid #9ca3af; border-radius: 3px; display: inline-block; margin-right: 5px; vertical-align: middle; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; }
  .empty { text-align: center; padding: 40px; color: #9ca3af; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">SparkleOps</div>
    <div style="font-size:12px;color:#6b7280;margin-top:3px">Daily Run Sheet${userName ? ` — ${userName}` : ''}</div>
  </div>
  <div>
    <div class="date-big">${fmtLong(date)}</div>
    <div class="date-sub">${fmtDay(date)}</div>
  </div>
</div>

${dayJobs.length === 0
  ? '<div class="empty">No jobs scheduled for this date.</div>'
  : `<div class="summary">${dayJobs.length} job${dayJobs.length !== 1 ? 's' : ''} scheduled</div>`}

${dayJobs.map((j, i) => {
  const endTime = calcEndTime(j.startTime, j.duration);
  return `
<div class="job">
  <div class="job-header">
    <div class="job-name">${i + 1}. ${j.name}</div>
    <div class="job-freq">${j.freq === 'weekly' ? 'Weekly' : 'Fortnightly'}</div>
  </div>

  ${j.startTime && endTime ? `
  <div class="time-block">
    <div class="time-col">
      <div class="time-lbl">Start</div>
      <div class="time-val">${fmtTime(j.startTime)}</div>
    </div>
    <div style="flex:1">
      <div class="time-bar"></div>
      <div class="time-dur">${fmtDuration(j.duration)}</div>
    </div>
    <div class="time-col">
      <div class="time-lbl">End</div>
      <div class="time-val">${fmtTime(endTime)}</div>
    </div>
  </div>` : ''}

  <div class="job-row"><span class="job-label">Mobile</span><span>${j.mob}</span></div>
  <div class="job-row"><span class="job-label">Address</span><span>${j.addr}</span></div>
  ${j.notes ? `<div class="notes-label">Notes</div><div class="notes">${j.notes}</div>` : ''}
  <div class="checks">
    <span><span class="box"></span>Job completed</span>
    <span><span class="box"></span>Payment received</span>
    <span><span class="box"></span>Customer satisfied</span>
  </div>
</div>`;
}).join('')}

<div class="footer">
  <span>SparkleOps — Cleaning Job Manager</span>
  <span>Printed ${new Date().toLocaleString('en-AU')}</span>
</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

export function exportJobsCSV(jobs) {
  const headers = ['Customer', 'Mobile', 'Address', 'Frequency', 'Next Date', 'Start Time', 'Duration (hrs)', 'Notes'];
  const esc = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
  const rows = jobs.map(j => [
    esc(j.name), esc(j.mob), esc(j.addr),
    j.freq, j.next,
    j.startTime || '', j.duration || 0,
    esc(j.notes),
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sparkleops-jobs-${todayStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
