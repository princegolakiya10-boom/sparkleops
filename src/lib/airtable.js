// ─────────────────────────────────────────────────────────────────────────────
//  lib/airtable.js
//
//  Table: Users
//    Id, Name, Email, Password, CreatedAt — all Single line text
//
//  Table: Jobs
//    Id, UserId, CustomerName, Mobile, Address, CreatedAt — Single line text
//    Notes        — Long text
//    NextDate     — Date (ISO format)
//    Frequency    — Single select: weekly | fortnightly
//    StartTime    — Single line text  (e.g. "08:30")   ← NEW
//    Duration     — Number (decimal hours, e.g. 2.5)   ← NEW
//
//  App job shape: { id, _recId, userId, name, mob, addr, notes, next, freq, startTime, duration }
// ─────────────────────────────────────────────────────────────────────────────

const BASE  = process.env.REACT_APP_AIRTABLE_BASE_ID;
const TOKEN = process.env.REACT_APP_AIRTABLE_TOKEN;
const ROOT  = `https://api.airtable.com/v0/${BASE}`;

async function req(path, opts = {}) {
  const res = await fetch(`${ROOT}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Airtable error ${res.status}`);
  }
  return res.json();
}

async function fetchAll(table, qs = '') {
  let records = [], offset = '';
  do {
    const sep = qs ? '&' : '?';
    const data = await req(`/${table}${qs}${offset ? `${sep}offset=${offset}` : ''}`);
    records = records.concat(data.records);
    offset = data.offset || '';
  } while (offset);
  return records;
}

function toUser(rec) {
  return {
    _recId: rec.id,
    id:       rec.fields.Id       || rec.id,
    name:     rec.fields.Name     || '',
    email:    rec.fields.Email    || '',
    password: rec.fields.Password || '',
  };
}

function toJob(rec) {
  return {
    _recId:    rec.id,
    id:        rec.fields.Id           || rec.id,
    userId:    rec.fields.UserId       || '',
    name:      rec.fields.CustomerName || '',
    mob:       rec.fields.Mobile       || '',
    addr:      rec.fields.Address      || '',
    notes:     rec.fields.Notes        || '',
    next:      rec.fields.NextDate     || '',
    freq:      rec.fields.Frequency    || 'weekly',
    startTime: rec.fields.StartTime    || '',
    duration:  rec.fields.Duration     || 0,
  };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email) {
  const enc = encodeURIComponent(`{Email}="${email}"`);
  const data = await req(`/Users?filterByFormula=${enc}&maxRecords=1`);
  if (!data.records.length) return null;
  return toUser(data.records[0]);
}

export async function createUser({ id, name, email, password }) {
  const data = await req('/Users', {
    method: 'POST',
    body: JSON.stringify({
      records: [{ fields: { Id: id, Name: name, Email: email, Password: password, CreatedAt: new Date().toISOString() } }],
    }),
  });
  return toUser(data.records[0]);
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function getJobsByUser(userId) {
  const enc = encodeURIComponent(`{UserId}="${userId}"`);
  const records = await fetchAll('Jobs', `?filterByFormula=${enc}&sort[0][field]=NextDate&sort[0][direction]=asc`);
  return records.map(toJob);
}

export async function createJob(job) {
  const data = await req('/Jobs', {
    method: 'POST',
    body: JSON.stringify({
      records: [{ fields: {
        Id: job.id, UserId: job.userId,
        CustomerName: job.name, Mobile: job.mob, Address: job.addr,
        Notes: job.notes, NextDate: job.next, Frequency: job.freq,
        StartTime: job.startTime || '',
        Duration:  job.duration  || 0,
        CreatedAt: new Date().toISOString(),
      }}],
    }),
  });
  return toJob(data.records[0]);
}

export async function updateJob(job) {
  const data = await req(`/Jobs/${job._recId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: {
      CustomerName: job.name, Mobile: job.mob, Address: job.addr,
      Notes: job.notes, NextDate: job.next, Frequency: job.freq,
      StartTime: job.startTime || '',
      Duration:  job.duration  || 0,
    }}),
  });
  return toJob(data);
}

export async function deleteJob(recId) {
  await req(`/Jobs/${recId}`, { method: 'DELETE' });
}
