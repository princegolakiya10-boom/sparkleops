import React from 'react';
import { Modal, Avatar, Badge, Button, SectionTitle } from './UI';
import { fmtLong, fmtTime, calcEndTime, fmtDuration, nextOccurrences, jobStatus, todayStr } from '../lib/utils';
import styles from './JobDetail.module.css';

const STATUS = {
  today:    'today',
  overdue:  'overdue',
  tomorrow: 'tomorrow',
  thisweek: 'weekly',
  upcoming: 'upcoming',
};

export default function JobDetail({ job, onClose, onEdit, onDone, onPrint }) {
  const st      = STATUS[jobStatus(job.next)];
  const isDue   = job.next <= todayStr();
  const upcoming = nextOccurrences(job, 5);
  const endTime  = calcEndTime(job.startTime, job.duration);

  return (
    <Modal title="Client details" onClose={onClose} wide>
      <div className={styles.hero}>
        <Avatar name={job.name} size={52} />
        <div>
          <div className={styles.heroName}>{job.name}</div>
          <div className={styles.heroSub}>
            {job.freq === 'weekly' ? 'Weekly' : 'Fortnightly'} recurring client
          </div>
        </div>
        <div className={styles.heroBadge}>
          <Badge variant={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</Badge>
        </div>
      </div>

      <SectionTitle>Contact &amp; location</SectionTitle>
      <dl className={styles.dl}>
        <dt>Mobile</dt>
        <dd><a href={`tel:${job.mob}`} className={styles.link}>{job.mob}</a></dd>
        <dt>Address</dt>
        <dd>{job.addr}</dd>
        <dt>Frequency</dt>
        <dd>{job.freq === 'weekly' ? 'Every week' : 'Every two weeks'}</dd>
        <dt>Next visit</dt>
        <dd>{fmtLong(job.next)}</dd>
        {job.startTime && <>
          <dt>Start time</dt>
          <dd className={styles.timeValue}>{fmtTime(job.startTime)}</dd>
        </>}
        {endTime && <>
          <dt>End time</dt>
          <dd className={styles.timeValue}>{fmtTime(endTime)}</dd>
        </>}
        {job.duration > 0 && <>
          <dt>Duration</dt>
          <dd>{fmtDuration(job.duration)}</dd>
        </>}
      </dl>

      {/* Time block visual if time is set */}
      {job.startTime && endTime && (
        <div className={styles.timeBlock}>
          <div className={styles.timeBlockStart}>
            <div className={styles.timeBlockLabel}>Start</div>
            <div className={styles.timeBlockVal}>{fmtTime(job.startTime)}</div>
          </div>
          <div className={styles.timeBlockBar}>
            <div className={styles.timeBarFill} />
            <div className={styles.timeBarDur}>{fmtDuration(job.duration)}</div>
          </div>
          <div className={styles.timeBlockEnd}>
            <div className={styles.timeBlockLabel}>End</div>
            <div className={styles.timeBlockVal}>{fmtTime(endTime)}</div>
          </div>
        </div>
      )}

      <SectionTitle>Upcoming schedule</SectionTitle>
      <div className={styles.schedule}>
        {upcoming.map((d, i) => (
          <span key={d} className={`${styles.schChip} ${i === 0 ? styles.schFirst : ''}`}>
            {fmtLong(d)}
            {i === 0 && job.startTime && (
              <span className={styles.chipTime}> · {fmtTime(job.startTime)}</span>
            )}
          </span>
        ))}
      </div>

      {job.notes && (
        <>
          <SectionTitle>Notes</SectionTitle>
          <div className={styles.notes}>{job.notes}</div>
        </>
      )}

      <div className={styles.footer}>
        <Button variant="primary" onClick={() => { onClose(); onEdit(job); }}>Edit job</Button>
        {isDue && <Button variant="success" onClick={() => { onDone(job); onClose(); }}>✓ Mark done &amp; schedule next</Button>}
        <Button variant="secondary" onClick={onPrint}>🖨 Print run sheet</Button>
      </div>
    </Modal>
  );
}
