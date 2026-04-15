import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { initials } from '../lib/utils';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <div className={styles.mark}>S</div>
        <span className={styles.name}>SparkleOps</span>
      </div>
      {user && (
        <div className={styles.right}>
          <div className={styles.userPill}>
            <div className={styles.avatar}>{initials(user.name)}</div>
            <span className={styles.userName}>{user.name}</span>
          </div>
          <button className={styles.signout} onClick={logout}>Sign out</button>
        </div>
      )}
    </header>
  );
}
