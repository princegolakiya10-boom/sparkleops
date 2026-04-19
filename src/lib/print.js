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

export function printWeeklyInvoice(jobs, userName) {
  const RATE  = 32.38;
  const EXTRA = 26;

  // Current calendar week: Monday → Sunday
  const today      = new Date();
  const dow        = today.getDay(); // 0 Sun … 6 Sat
  const toMonday   = dow === 0 ? -6 : 1 - dow;
  const monday     = new Date(today); monday.setDate(today.getDate() + toMonday);
  const sunday     = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const localStr   = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const weekStart  = localStr(monday);
  const weekEnd    = localStr(sunday);

  const weekJobs = jobs
    .filter(j => j.next >= weekStart && j.next <= weekEnd)
    .sort((a, b) => a.next.localeCompare(b.next) || (a.startTime||'').localeCompare(b.startTime||''));

  const rows = weekJobs.map(j => ({
    ...j,
    amount: (j.duration || 0) * RATE + EXTRA,
  }));
  const subtotal = rows.reduce((s, r) => s + r.amount, 0);
  const gst      = subtotal * 0.1;
  const total    = subtotal + gst;

  const invoiceNo   = `INV-${todayStr().replace(/-/g,'')}`;
  const issuedDate  = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });
  const periodLabel = `${monday.toLocaleDateString('en-AU',{day:'numeric',month:'short'})} – ${sunday.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}`;

  const fmt2 = (n) => n.toFixed(2);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Invoice ${invoiceNo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; padding: 40px; }
  /* Header */
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
  .brand { font-size: 26px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
  .brand-sub { font-size: 12px; color: #6b7280; margin-top: 3px; }
  .inv-meta { text-align: right; }
  .inv-num { font-size: 22px; font-weight: 700; color: #111827; }
  .inv-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  /* From / To */
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 24px; }
  .party-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
  .party-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .party-detail { font-size: 12px; color: #6b7280; }
  /* Details strip */
  .details-strip { display: flex; gap: 0; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 28px; }
  .detail-cell { flex: 1; padding: 14px 18px; border-right: 1px solid #e5e7eb; }
  .detail-cell:last-child { border-right: none; }
  .detail-cell-label { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
  .detail-cell-val { font-size: 14px; font-weight: 600; color: #111827; }
  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #1e40af; color: #fff; }
  thead th { padding: 11px 14px; font-size: 11px; font-weight: 600; text-align: left; letter-spacing: 0.4px; }
  thead th:last-child { text-align: right; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  tbody td { padding: 11px 14px; font-size: 13px; color: #374151; vertical-align: middle; }
  tbody td:last-child { text-align: right; font-weight: 600; color: #111827; }
  .row-num { color: #9ca3af; font-size: 12px; }
  /* Totals */
  .totals { margin-left: auto; width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
  .totals-row:last-child { border-bottom: none; }
  .totals-label { color: #6b7280; }
  .totals-val { font-weight: 600; color: #111827; }
  .totals-total { background: #1e40af; color: #fff; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; margin-top: 10px; font-size: 15px; font-weight: 700; }
  /* Footer */
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
  .empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 14px; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>

<div class="page-header">
  <div>
    <div class="brand">SparkleOps</div>
    <div class="brand-sub">Cleaning Services</div>
  </div>
  <div class="inv-meta">
    <div class="inv-label">Invoice</div>
    <div class="inv-num">${invoiceNo}</div>
  </div>
</div>

<div class="parties">
  <div>
    <div class="party-label">From</div>
    <div class="party-name">${userName || 'SparkleOps Operator'}</div>
    <div class="party-detail">Cleaning Services</div>
  </div>
  <div>
    <div class="party-label">Invoice details</div>
    <div class="party-detail" style="margin-bottom:3px"><strong>Issued:</strong> ${issuedDate}</div>
    <div class="party-detail"><strong>Period:</strong> ${periodLabel}</div>
  </div>
</div>

<div class="details-strip">
  <div class="detail-cell">
    <div class="detail-cell-label">Invoice No.</div>
    <div class="detail-cell-val">${invoiceNo}</div>
  </div>
  <div class="detail-cell">
    <div class="detail-cell-label">Period</div>
    <div class="detail-cell-val">${periodLabel}</div>
  </div>
  <div class="detail-cell">
    <div class="detail-cell-label">Jobs</div>
    <div class="detail-cell-val">${rows.length}</div>
  </div>
  <div class="detail-cell">
    <div class="detail-cell-label">Total (inc. GST)</div>
    <div class="detail-cell-val" style="color:#1e40af">$${fmt2(total)}</div>
  </div>
</div>

${rows.length === 0
  ? '<div class="empty">No jobs found for this week.</div>'
  : `<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Customer</th>
      <th>Date of Cleaning</th>
      <th>Service</th>
      <th>Amount (AUD)</th>
    </tr>
  </thead>
  <tbody>
    ${rows.map((r, i) => `
    <tr>
      <td class="row-num">${i + 1}</td>
      <td><strong>${r.name}</strong></td>
      <td>${fmtLong(r.next)}</td>
      <td>Cleaning service</td>
      <td>$${fmt2(r.amount)}</td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="totals">
  <div class="totals-row">
    <span class="totals-label">Subtotal</span>
    <span class="totals-val">$${fmt2(subtotal)}</span>
  </div>
  <div class="totals-row">
    <span class="totals-label">GST (10%)</span>
    <span class="totals-val">$${fmt2(gst)}</span>
  </div>
  <div class="totals-total">
    <span>Total Due (AUD)</span>
    <span>$${fmt2(total)}</span>
  </div>
</div>`}

<div class="footer">
  <span>SparkleOps — ${userName || ''}</span>
  <span>Generated ${new Date().toLocaleString('en-AU')}</span>
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
