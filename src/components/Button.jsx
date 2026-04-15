import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children, variant = 'default', size = 'md',
  full = false, disabled = false, loading = false,
  onClick, type = 'button', className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        full ? styles.full : '',
        loading ? styles.loading : '',
        className,
      ].join(' ')}
    >
      {loading ? <span className={styles.spinner} /> : null}
      {children}
    </button>
  );
}
