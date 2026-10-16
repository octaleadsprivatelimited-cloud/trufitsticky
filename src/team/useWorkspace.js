import { useEffect, useState } from 'react';
import { readWorkspace, WORKSPACE_EVENT, writeWorkspace } from './store.mjs';

export default function useWorkspace() {
  const [workspace, setWorkspace] = useState(readWorkspace);
  useEffect(() => {
    const refresh = () => setWorkspace(readWorkspace());
    window.addEventListener(WORKSPACE_EVENT, refresh);
    return () => window.removeEventListener(WORKSPACE_EVENT, refresh);
  }, []);
  function save(next) { writeWorkspace(next); setWorkspace(next); }
  return [workspace, save];
}
