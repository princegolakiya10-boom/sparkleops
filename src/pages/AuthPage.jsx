import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Input, Button, Spinner } from '../components/UI';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode]   = useState('login');
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErr(''); };
  const sw  = (m)    => { setMode(m); setErr(''); };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (mode === 'login') {
      if (!form.email || !form.password) { setErr('Email and password are required.'); return; }
    } else {
      if (!form.name || !form.email || !form.password) { setErr('All fields are required.'); return; }
      if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    }
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else                  await signup(form.name, form.email, form.password);
    } catch (ex) {
      setErr(ex.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>S</div>
          <div>
            <div className={styles.brandName}>SparkleOps</div>
            <div className={styles.brandSub}>Cleaning job manager</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'login'  ? styles.tabOn : ''}`} onClick={() => sw('login')}>Sign in</button>
          <button className={`${styles.tab} ${mode === 'signup' ? styles.tabOn : ''}`} onClick={() => sw('signup')}>Create account</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <Input label="Full name" id="name" type="text" value={form.name}
              onChange={e => set('name', e.target.value)} placeholder="Your name" />
          )}
          <div style={{ marginTop: mode === 'signup' ? 12 : 0 }}>
            <Input label="Email address" id="email" type="email" value={form.email}
              onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Input label="Password" id="password" type="password" value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'} />
          </div>

          {err && <div className={styles.err}>{err}</div>}

          <div style={{ marginTop: 18 }}>
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={busy}>
              {busy ? <Spinner size={16} /> : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </div>
        </form>

        <div className={styles.switchHint}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => sw(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
