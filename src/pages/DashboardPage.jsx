import React, { useState, useMemo } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { todayStr, tomorrowStr, weekEndStr } from '../lib/utils';
import { printDailyRunSheet, exportJobsCSV } from '../lib/print';
import { StatCard, Button, Modal, EmptyState, Spinner } from '../components/UI';
import JobCard from '../components/JobCard';
import JobDetail from '../components/JobDetail';
import JobForm from '../components/JobForm';
import { initials } from '../lib/utils';
import styles from './DashboardPage.module.css';

const FILTERS = [
  { key: 'today',    label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week',     label: 'This week' },
  { key: 'all',      label: 'All jobs' },
  { key: 'custom',   label: 'Pick date' },
];

export default function DashboardPage() {
  const { user, logout }  = useAuth();
  const { jobs, loading, error, addJob, editJob, removeJob, markDone } = useJobs(user?.id);

  const [filter, setFilter]         = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [search, setSearch]         = useState('');
  const [detailJob, setDetailJob]   = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [formBusy, setFormBusy]     = useState(false);
  const [formErr, setFormErr]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy]     = useState(false);

  const t = todayStr(), tm = tomorrowStr(), we = weekEndStr();

  const stats = useMemo(() => ({
    today:    jobs.filter(j => j.next === t).length,
    tomorrow: jobs.filter(j => j.next === tm).length,
    week:     jobs.filter(j => j.next >= t && j.next <= we).length,
    total:    jobs.length,
  }), [jobs, t, tm, we]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (filter === 'today')    list = list.filter(j => j.next === t);
    if (filter === 'tomorrow') list = list.filter(j => j.next === tm);
    if (filter === 'week')     list = list.filter(j => j.next >= t && j.next <= we);
    if (filter === 'custom' && customDate) list = list.filter(j => j.next === customDate);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.name.toLowerCase().includes(q) ||
        j.addr.toLowerCase().includes(q) ||
        j.mob.includes(q) ||
        j.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, filter, customDate, search, t, tm, we]);

  const handleSave = async (form) => {
    setFormBusy(true); setFormErr('');
    try {
      if (editTarget?.id) await editJob({ ...editTarget, ...form });
      else                await addJob(form);
      setEditTarget(null);
    } catch (e) {
      setFormErr(e.message || 'Failed to save. Check your Airtable credentials.');
    } finally { setFormBusy(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await removeJob(deleteTarget);
      setDeleteTarget(null);
      if (detailJob?.id === deleteTarget.id) setDetailJob(null);
    } catch (e) { alert(e.message); }
    finally { setDeleteBusy(false); }
  };

  const handleMarkDone = async (job) => {
    await markDone(job);
    if (detailJob?.id === job.id) {
      setDetailJob(prev => ({ ...prev, next: '' }));
    }
  };

  const handlePrint = (job) => {
    const date = job?.next || (filter === 'custom' && customDate ? customDate : todayStr());
    printDailyRunSheet(jobs, date, user?.name);
  };

  return (
    <div className={styles.page}>

      {/* ── TOPBAR ─────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.logo}>S</div>
          <span className={styles.logoText}>SparkleOps</span>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.iconBtn} onClick={() => exportJobsCSV(jobs)} title="Export CSV">
            ↓ Export
          </button>
          <button className={styles.iconBtn} onClick={() => handlePrint(null)} title="Print today's run sheet">
            🖨 Run sheet
          </button>
          <div className={styles.userPill}>
            <div className={styles.userAvatar}>{initials(user?.name || '')}</div>
            <span className={styles.userName}>{user?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </header>

      <main className={styles.main}>

        {/* ── STATS ──────────────────────────────────────── */}
        <div className={styles.stats}>
          <StatCard label="Today"         value={stats.today}    sub="jobs due"      colorClass="colorAmber" />
          <StatCard label="Tomorrow"      value={stats.tomorrow} sub="upcoming"      colorClass="colorBlue" />
          <StatCard label="This week"     value={stats.week}     sub="within 7 days" colorClass="colorGreen" />
          <StatCard label="Total clients" value={stats.total}    sub="active"        colorClass="colorGray" />
        </div>

        {/* ── TOOLBAR ────────────────────────────────────── */}
        <div className={styles.toolbar}>
          <div className={styles.chips}>
            {FILTERS.map(f => (
              <button key={f.key}
                className={`${styles.chip} ${filter === f.key ? styles.chipOn : ''}`}
                onClick={() => { setFilter(f.key); if (f.key !== 'custom') setCustomDate(''); }}>
                {f.label}
              </button>
            ))}
            {filter === 'custom' && (
              <input type="date" className={styles.datePick} value={customDate}
                onChange={e => setCustomDate(e.target.value)} />
            )}
          </div>
          <div className={styles.toolbarRight}>
            <input className={styles.search} placeholder="Search jobs…" value={search}
              onChange={e => setSearch(e.target.value)} />
            <Button variant="primary" onClick={() => setEditTarget({})}>+ Add job</Button>
          </div>
        </div>

        <div className={styles.resultCount}>
          {filtered.length} job{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </div>

        {/* ── ERROR / LOADING ─────────────────────────────── */}
        {error && <div className={styles.errBanner}>{error}</div>}
        {loading && (
          <div className={styles.loadingWrap}><Spinner size={22} /><span>Loading jobs…</span></div>
        )}

        {/* ── JOB LIST ────────────────────────────────────── */}
        {!loading && (
          <div className={styles.jobList}>
            {filtered.length === 0 ? (
              <EmptyState
                icon="📋"
                title={search ? 'No jobs match your search' : 'No jobs for this filter'}
                body={search ? 'Try different keywords.' : 'Try a different date or add a new job.'}
                action={!search && <Button variant="primary" onClick={() => setEditTarget({})}>+ Add job</Button>}
              />
            ) : filtered.map(job => (
              <JobCard key={job.id} job={job}
                onView={setDetailJob}
                onEdit={j => setEditTarget(j)}
                onDone={handleMarkDone}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── DETAIL MODAL ────────────────────────────────── */}
      {detailJob && (
        <JobDetail
          job={jobs.find(j => j.id === detailJob.id) || detailJob}
          onClose={() => setDetailJob(null)}
          onEdit={j => { setDetailJob(null); setEditTarget(j); }}
          onDone={handleMarkDone}
          onPrint={() => handlePrint(detailJob)}
        />
      )}

      {/* ── FORM MODAL ──────────────────────────────────── */}
      {editTarget !== null && (
        <Modal title={editTarget?.id ? 'Edit job' : 'New job'} onClose={() => setEditTarget(null)} wide>
          {formErr && <div className={styles.errBanner} style={{ margin: '0 0 14px' }}>{formErr}</div>}
          <JobForm
            initial={editTarget?.id ? editTarget : null}
            onSave={handleSave}
            onCancel={() => setEditTarget(null)}
            loading={formBusy}
          />
        </Modal>
      )}

      {/* ── DELETE CONFIRM ──────────────────────────────── */}
      {deleteTarget && (
        <Modal title="Remove job" onClose={() => setDeleteTarget(null)}>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 20 }}>
            Are you sure you want to remove <strong>{deleteTarget.name}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="danger" onClick={handleDelete} disabled={deleteBusy}>
              {deleteBusy && <Spinner size={14} />} Remove
            </Button>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
