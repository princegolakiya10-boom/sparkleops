import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children, color = 'gray' }) {
  return <span className={`${styles.badge} ${styles[color]}`}>{children}</span>;
}
