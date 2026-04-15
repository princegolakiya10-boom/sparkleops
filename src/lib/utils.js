export const todayStr    = () => new Date().toISOString().slice(0, 10);
export const tomorrowStr = () => addDays(todayStr(), 1);
export const weekEndStr  = () => addDays(todayStr(), 7);

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
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
