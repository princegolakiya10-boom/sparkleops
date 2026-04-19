export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const tomorrowStr = () => addDays(todayStr(), 1);
export const weekEndStr  = () => addDays(todayStr(), 7);

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtLong(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function fmtShort(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short',
  });
}

export function fmtDay(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'long' });
}

export function nextOccurrences(job, count = 5) {
  const step = job.freq === 'weekly' ? 7 : 14;
  return Array.from({ length: count }, (_, i) => addDays(job.next, i * step));
}

export function advanceJob(job) {
  const step = job.freq === 'weekly' ? 7 : 14;
  return { ...job, next: addDays(job.next, step) };
}

export function jobStatus(next) {
  const t = todayStr();
  if (next < t)               return 'overdue';
  if (next === t)             return 'today';
  if (next === tomorrowStr()) return 'tomorrow';
  if (next <= weekEndStr())   return 'thisweek';
  return 'upcoming';
}

export function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Time helpers ─────────────────────────────────────────────────────────────

/** Calculate end time string given a start time "HH:MM" and duration in hours (can be decimal) */
export function calcEndTime(startTime, durationHours) {
  if (!startTime || !durationHours) return '';
  const [h, m] = startTime.split(':').map(Number);
  const totalMins = h * 60 + m + Math.round(durationHours * 60);
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

/** Format "HH:MM" to "8:30 AM" style */
export function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Format a duration number to a human label */
export function fmtDuration(hours) {
  if (!hours) return '';
  if (hours === 1) return '1 hr';
  if (Number.isInteger(hours)) return `${hours} hrs`;
  const whole = Math.floor(hours);
  const mins = Math.round((hours - whole) * 60);
  if (whole === 0) return `${mins} min`;
  return `${whole} hr ${mins} min`;
}
