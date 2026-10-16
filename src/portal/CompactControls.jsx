import { useEffect, useRef } from 'react';

export function CompactTabs({ id, label, value, items, onChange }) {
  function keyboard(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next == null) return;
    event.preventDefault(); onChange(items[next].id);
    event.currentTarget.parentElement.querySelectorAll('button')[next]?.focus();
  }
  return <div className="portal-section-controls"><div className="portal-section-tabs" role="tablist" aria-label={label}>{items.map((item,index) => <button key={item.id} id={`${id}-tab-${item.id}`} role="tab" type="button" aria-selected={value === item.id} aria-controls={`${id}-panel-${item.id}`} tabIndex={value === item.id ? 0 : -1} onKeyDown={event => keyboard(event,index)} onClick={() => onChange(item.id)}>{item.label}</button>)}</div><label className="portal-section-select"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>;
}
export function CompactPanel({ id, active, value, children }) { return <section className="portal-tab-panel" id={`${id}-panel-${value}`} role="tabpanel" aria-labelledby={`${id}-tab-${value}`} hidden={active !== value}>{children}</section>; }
export function PortalDialog({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current, previous = document.activeElement, overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="portal-detail-dialog" aria-labelledby="portal-detail-title" onCancel={onClose} data-lenis-prevent><header><h2 id="portal-detail-title">{title}</h2><button type="button" onClick={onClose} aria-label="Close details">×</button></header>{children}</dialog>;
}
export function PortalPager({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages < 2) return null;
  return <nav className="portal-pager" aria-label="Results pages"><span>{page * pageSize + 1}–{Math.min((page + 1) * pageSize,total)} of {total}</span><div><button type="button" disabled={page === 0} onClick={() => onChange(page - 1)}>Previous</button><span>{page + 1} / {pages}</span><button type="button" disabled={page + 1 >= pages} onClick={() => onChange(page + 1)}>Next</button></div></nav>;
}
