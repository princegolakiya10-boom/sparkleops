import React, { useState } from 'react';
import { Button, Input, Textarea, SectionTitle, Spinner } from './UI';
import { todayStr } from '../lib/utils';
import styles from './JobForm.module.css';

const EMPTY = { name: '', mob: '', addr: '', notes: '', next: todayStr(), freq: 'weekly' };

export default function JobForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name || '', mob: initial.mob || '', addr: initial.addr || '',
    notes: initial.notes || '', next: initial.next || todayStr(), freq: initial.freq || 'weekly',
  } : EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = 'Customer name is required.';
    if (!form.mob.trim())   e.mob  = 'Mobile number is required.';
    if (!form.addr.trim())  e.addr = 'Address is required.';
    if (!form.next)         e.next = 'Date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
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
          onClick={() => set('freq', 'weekly')}>
          Weekly
        </button>
        <button type="button"
          className={`${styles.freqOpt} ${form.freq === 'fortnightly' ? styles.freqOn : ''}`}
          onClick={() => set('freq', 'fortnightly')}>
          Fortnightly
        </button>
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
