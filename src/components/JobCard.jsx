import React from 'react';
import { Badge, Button, Card } from './UI';
import { fmtShort, fmtDay, fmtTime, calcEndTime, fmtDuration, jobStatus, todayStr } from '../lib/utils';
import styles from './JobCard.module.css';

const STATUS = {
  today:    { label: 'Today',     variant: 'today' },
  overdue:  { label: 'Overdue',   variant: 'overdue' },
  tomorrow: { label: 'Tomorrow',  variant: 'tomorrow' },
  thisweek: { label: 'This week', variant: 'weekly' },
  upcoming: { label: 'Upcoming',  variant: 'upcoming' },
};

export default function JobCard({ job, onView, onEdit, onDone, onDelete }) {
  const st    = STATUS[jobStatus(job.next)];
  const isDue = job.next <= todayStr();
  const endTime = calcEndTime(job.startTime, job.duration);

  return (
    <Card className={styles.card} onClick={() => onView(job)}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.name}>{job.name}</div>
          <div className={styles.addr}>{job.addr}</div>
        </div>
        <div className={styles.dateCol}>
          <div className={styles.date}>{fmtShort(job.next)}</div>
          <div className={styles.day}>{fmtDay(job.next)}</div>
          {job.startTime && (
            <div className={styles.time}>
              {fmtTime(job.startTime)}
              {endTime && <span className={styles.timeSep}> – </span>}
              {endTime && fmtTime(endTime)}
            </div>
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <Badge variant={st.variant}>{st.label}</Badge>
        <Badge variant={job.freq === 'weekly' ? 'weekly' : 'fortnightly'}>
          {job.freq === 'weekly' ? 'Weekly' : 'Fortnightly'}
        </Badge>
        {job.duration > 0 && (
          <Badge variant="gray">{fmtDuration(job.duration)}</Badge>
        )}
        <span className={styles.mob}>{job.mob}</span>
      </div>

      <div className={styles.actions} onClick={e => e.stopPropagation()}>
        <Button variant="secondary" size="sm" onClick={() => onView(job)}>View details</Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(job)}>Edit</Button>
        {isDue && (
          <Button variant="success" size="sm" onClick={() => onDone(job)}>✓ Mark done</Button>
        )}
        <Button variant="danger" size="sm" onClick={() => onDelete(job)}>Remove</Button>
      </div>
    </Card>
  );
}
