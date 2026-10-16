import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('resize',callback);
  return () => window.removeEventListener('resize',callback);
}
function pageSize() {
  if (window.innerHeight < 600) return 1;
  if (window.innerWidth < 768) return window.innerHeight < 780 ? 1 : 2;
  return window.innerHeight < 820 ? 3 : 4;
}
export default function useProductPageSize() { return useSyncExternalStore(subscribe,pageSize,() => 4); }
