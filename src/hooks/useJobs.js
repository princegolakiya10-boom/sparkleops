import { useState, useEffect, useCallback } from 'react';
import { getJobsByUser, createJob, updateJob, deleteJob as apiDelete } from '../lib/airtable';
import { uid, advanceJob } from '../lib/utils';

export function useJobs(userId) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      setJobs(await getJobsByUser(userId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const sorted = (list) => [...list].sort((a, b) => a.next.localeCompare(b.next));

  async function addJob(fields) {
    const job = { id: uid(), userId, ...fields };
    const saved = await createJob(job);
    setJobs(prev => sorted([...prev, saved]));
    return saved;
  }

  async function editJob(job) {
    const saved = await updateJob(job);
    setJobs(prev => sorted(prev.map(j => j._recId === saved._recId ? saved : j)));
    return saved;
  }

  async function removeJob(job) {
    await apiDelete(job._recId);
    setJobs(prev => prev.filter(j => j._recId !== job._recId));
  }

  async function markDone(job) {
    return editJob(advanceJob(job));
  }

  return { jobs, loading, error, reload: load, addJob, editJob, removeJob, markDone };
}
