import React from 'react';
import s from './UI.module.css';
import { initials } from '../lib/utils';

export function Button({ children, variant = 'secondary', size = 'md', fullWidth, onClick, type = 'button', disabled }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${s.btn} ${s[`btn-${variant}`]} ${s[`btn-${size}`]} ${fullWidth ? s['btn-full'] : ''}`}>
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'gray' }) {
  return <span className={`${s.badge} ${s[`badge-${variant}`]}`}>{children}</span>;
}

export function Input({ label, id, error, ...rest }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label} htmlFor={id}>{label}</label>}
      <input id={id} className={`${s.input} ${error ? s['input-err'] : ''}`} {...rest} />
      {error && <span className={s['field-err']}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, id, error, ...rest }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label} htmlFor={id}>{label}</label>}
      <textarea id={id} className={`${s.input} ${s.textarea} ${error ? s['input-err'] : ''}`} {...rest} />
      {error && <span className={s['field-err']}>{error}</span>}
    </div>
  );
}

export function Spinner({ size = 18 }) {
  return (
    <svg className={s.spinner} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`${s.card} ${onClick ? s['card-click'] : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, colorClass }) {
  return (
    <div className={s.statCard}>
      <div className={s.statLabel}>{label}</div>
      <div className={`${s.statNum} ${s[colorClass]}`}>{value}</div>
      {sub && <div className={s.statSub}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <div className={s.sectionTitle}>{children}</div>;
}

export function Avatar({ name, size = 40 }) {
  return (
    <div className={s.avatar} style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials(name)}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <div className={s.empty}>
      <div className={s.emptyIcon}>{icon}</div>
      <div className={s.emptyTitle}>{title}</div>
      {body && <div className={s.emptyBody}>{body}</div>}
      {action}
    </div>
  );
}

export function Modal({ title, children, onClose, wide }) {
  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`${s.modal} ${wide ? s.modalWide : ''}`}>
        <div className={s.modalHeader}>
          <span className={s.modalTitle}>{title}</span>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={s.modalBody}>{children}</div>
      </div>
    </div>
  );
}
