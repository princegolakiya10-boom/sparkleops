import React, { useState } from 'react';
import { Button, Input, Textarea, SectionTitle, Spinner } from './UI';
import { todayStr, calcEndTime, fmtTime } from '../lib/utils';
import styles from './JobForm.module.css';

const DURATION_OPTIONS = [
  { value: 0.5, label: '30 min' },
  { value: 1,   label: '1 hr' },
  { value: 1.5, label: '1.5 hrs' },
  { value: 2,   label: '2 hrs' },
  { value: 2.5, label: '2.5 hrs' },
  { value: 3,   label: '3 hrs' },
  { value: 3.5, label: '3.5 hrs' },
  { value: 4,   label: '4 hrs' },
  { value: 5,   label: '5 hrs' },
  { value: 6,   label: '6 hrs' },
  { value: 7,   label: '7 hrs' },
  { value: 8,   label: '8 hrs' },
];

const EMPTY = {
  name: '', mob: '', addr: '', notes: '',
  next: todayStr(), freq: 'weekly',
  startTime: '08:00', duration: 2,
};

export default function JobForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial ? {
    name:      initial.name      || '',
    mob:       initial.mob       || '',
    addr:      initial.addr      || '',
    notes:     initial.notes     || '',
    next:      initial.next      || todayStr(),
    freq:      initial.freq      || 'weekly',
    startTime: initial.startTime || '08:00',
    duration:  initial.duration  || 2,
  } : EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const endTime = calcEndTime(form.startTime, form.duration);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Customer name is required.';
    if (!form.mob.trim())  e.mob  = 'Mobile number is required.';
    if (!form.addr.trim()) e.addr = 'Address is required.';
    if (!form.next)        e.next = 'Date is required.';
    if (!form.startTime)   e.startTime = 'Start time is required.';
    if (!form.duration)    e.duration  = 'Duration is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({ ...form, duration: Number(form.duration) });
  };

  return (
    <form onSubmit={submit}>
      <SectionTitle>Customer info</SectionTitle>
      <Input label="Customer name *" id="name" value={form.name}
        onChange={e => set('name', e.target.value)}
        placeholder="Full name or business name" error={errors.name} />

      <div className={styles.row2} style={{ marginTop: 12 }}>
        <Input label="Mobile *" id="mob" value={form.mob}
          onChange={e => set('mob', e.target.value)}
          placeholder="04xx xxx xxx" error={errors.mob} />
        <Input label="Next job date *" id="next" type="date" value={form.next}
          onChange={e => set('next', e.target.value)} error={errors.next} />
      </div>

      <div style={{ marginTop: 12 }}>
        <Input label="Address *" id="addr" value={form.addr}
          onChange={e => set('addr', e.target.value)}
          placeholder="Street address, suburb" error={errors.addr} />
      </div>

      <SectionTitle>Schedule</SectionTitle>

      <div className={styles.freqGroup}>
        <button type="button"
          className={`${styles.freqOpt} ${form.freq === 'weekly' ? styles.freqOn : ''}`}
          onClick={() => set('freq', 'weekly')}>Weekly</button>
        <button type="button"
          className={`${styles.freqOpt} ${form.freq === 'fortnightly' ? styles.freqOn : ''}`}
          onClick={() => set('freq', 'fortnightly')}>Fortnightly</button>
      </div>

      <div className={styles.row3} style={{ marginTop: 14 }}>
        {/* Start time */}
        <div className={styles.timeField}>
          <label className={styles.fieldLabel} htmlFor="startTime">Start time *</label>
          <input
            id="startTime" type="time" value={form.startTime}
            onChange={e => set('startTime', e.target.value)}
            className={`${styles.timeInput} ${errors.startTime ? styles.inputErr : ''}`}
          />
          {errors.startTime && <span className={styles.fieldErr}>{errors.startTime}</span>}
        </div>

        {/* Duration */}
        <div className={styles.timeField}>
          <label className={styles.fieldLabel} htmlFor="duration">Duration *</label>
          <select
            id="duration" value={form.duration}
            onChange={e => set('duration', parseFloat(e.target.value))}
            className={`${styles.timeInput} ${errors.duration ? styles.inputErr : ''}`}
          >
            {DURATION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.duration && <span className={styles.fieldErr}>{errors.duration}</span>}
        </div>

        {/* Auto-calculated end time */}
        <div className={styles.timeField}>
          <label className={styles.fieldLabel}>End time</label>
          <div className={styles.endTimeDisplay}>
            {endTime ? fmtTime(endTime) : '—'}
          </div>
          <span className={styles.endTimeHint}>auto-calculated</span>
        </div>
      </div>

      <SectionTitle>Notes</SectionTitle>
      <Textarea
        label="Customer notes — access info, preferences, pets, products, anything relevant"
        id="notes" value={form.notes}
        onChange={e => set('notes', e.target.value)}
        placeholder="Key under the mat, eco products only, has a dog named Max, no bleach..."
        rows={7}
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="md" disabled={loading}>
          {loading && <Spinner size={14} />}
          {initial ? 'Save changes' : 'Add job'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
