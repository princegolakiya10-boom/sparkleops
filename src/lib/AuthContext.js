import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, createUser } from './airtable';
import { uid } from './utils';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    try {
      const s = localStorage.getItem('so_user');
      if (s) setUser(JSON.parse(s));
    } catch (_) {}
    setLoading(false);
  }, []);

  const persist = (u) => {
    localStorage.setItem('so_user', JSON.stringify(u));
    setUser(u);
  };

  async function login(email, password) {
    setError('');
    const u = await getUserByEmail(email.trim().toLowerCase());
    if (!u || u.password !== password) throw new Error('Incorrect email or password.');
    persist({ _recId: u._recId, id: u.id, name: u.name, email: u.email });
  }

  async function signup(name, email, password) {
    setError('');
    const existing = await getUserByEmail(email.trim().toLowerCase());
    if (existing) throw new Error('That email is already registered.');
    const u = await createUser({ id: uid(), name: name.trim(), email: email.trim().toLowerCase(), password });
    persist({ _recId: u._recId, id: u.id, name: u.name, email: u.email });
  }

  function logout() {
    localStorage.removeItem('so_user');
    setUser(null);
  }

  function clearError() { setError(''); }

  return (
    <Ctx.Provider value={{ user, loading, error, login, signup, logout, clearError }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() { return useContext(Ctx); }
