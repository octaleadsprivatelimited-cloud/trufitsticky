import { useEffect, useRef, useState } from 'react';
import { PortalPager } from '../portal/CompactControls';
import useProductPageSize from '../portal/useProductPageSize';
import { affiliateLink } from '../portal/products.mjs';
import { blankProduct, sampleCustomers, updateProduct, validateProduct } from './store.mjs';

function ProductDialog({ product, workspace, saveWorkspace, onClose, onSaved }) {
  const [values, setValues] = useState(() => structuredClone(product));
  const [audience, setAudience] = useState(product.customerIds.length ? 'selected' : 'all');
  const [error, setError] = useState('');
  const [section, setSection] = useState('details');
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current, previous = document.activeElement, overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  function update(key, value) { setValues(current => ({ ...current, [key]: value })); setError(''); }
  function save(publish) {
    const next = { ...values, customerIds: audience === 'all' ? [] : values.customerIds };
    const failure = validateProduct(next, publish) || (audience === 'selected' && !next.customerIds.length ? 'Choose at least one customer.' : '');
    if (failure) { setError(failure); setSection(!next.name.trim() || !next.description.trim() ? 'details' : 'links'); return; }
    try { saveWorkspace(updateProduct(workspace, next, publish)); onSaved(publish ? 'Product published to the selected customer previews.' : 'Product draft saved. It is not visible to customers.'); onClose(); }
    catch { setError('Your browser could not save the product. Keep this form open and try again.'); }
  }
  return <dialog ref={dialog} className="team-product-dialog" aria-labelledby="team-product-title" onCancel={onClose} data-lenis-prevent><div className="team-section-heading"><div><span className="team-kicker">Product recommendations</span><h2 id="team-product-title">{product.id ? 'Edit product' : 'Add a product'}</h2></div><button className="team-dialog-close" type="button" onClick={onClose} aria-label="Close product editor">×</button></div><div className="team-editor-tabs" role="group" aria-label="Product editor sections">{[['details','Details'],['note','Coach’s note'],['links','Link & audience']].map(([id,label]) => <button type="button" key={id} aria-pressed={section === id} onClick={() => setSection(id)}>{label}</button>)}</div><form noValidate onSubmit={event => { event.preventDefault(); save(true); }}>
    <div hidden={section !== 'details'}><label className="team-field">Product name<input value={values.name} maxLength={160} placeholder="Exact product or model name" onChange={event => update('name', event.target.value)}/></label>
    <div className="team-field-grid"><label className="team-field">Category<select value={values.category} onChange={event => update('category', event.target.value)}>{['Strength', 'Mobility', 'Everyday', 'Recovery', 'Nutrition', 'Other'].map(item => <option key={item}>{item}</option>)}</select></label><label className="team-field">Illustration<select value={values.icon} onChange={event => update('icon', event.target.value)}><option value="bands">Resistance bands</option><option value="mat">Mat</option><option value="weights">Weights</option><option value="bottle">Bottle</option></select></label></div>
    <label className="team-field">Short description<textarea rows={2} maxLength={1500} value={values.description} placeholder="What is this product for?" onChange={event => update('description', event.target.value)}/></label>
    </div><div hidden={section !== 'note'}><label className="team-field">Coach’s recommendation note · optional<textarea rows={2} maxLength={1500} value={values.note} placeholder="Why it fits the customer’s training program…" onChange={event => update('note', event.target.value)}/></label>
    </div><div hidden={section !== 'links'}><label className="team-field">Affiliate link<input type="text" inputMode="url" aria-label="Affiliate link" aria-describedby="team-affiliate-hint" value={values.affiliateUrl} placeholder="https://retailer.com/product?affiliate=…" maxLength={3000} onChange={event => update('affiliateUrl', event.target.value)}/><small id="team-affiliate-hint">Use the exact HTTPS link provided by the team. No customer information is added to the URL.</small></label>
    <fieldset className="team-audience"><legend>Recommend to</legend><label><input type="radio" name="product-audience" checked={audience === 'all'} onChange={() => setAudience('all')}/>All customers</label><label><input type="radio" name="product-audience" checked={audience === 'selected'} onChange={() => setAudience('selected')}/>Selected customers</label>{audience === 'selected' && <div className="team-audience-customers">{sampleCustomers.map(customer => <label key={customer.id}><input type="checkbox" checked={values.customerIds.includes(customer.id)} onChange={event => update('customerIds', event.target.checked ? [...values.customerIds, customer.id] : values.customerIds.filter(id => id !== customer.id))}/>{customer.name}</label>)}</div>}</fieldset>
    </div>{error && <p className="team-feedback" role="alert">{error}</p>}<p className="team-fine-print">Publishing makes this product visible in the local customer preview. It does not place an order or contact the retailer.</p><div className="team-editor-actions">{product.status !== 'published' && <button className="team-button team-button-outline" type="button" onClick={() => save(false)}>Save draft</button>}<button className="team-button" type="submit">{product.status === 'published' ? 'Save and publish' : 'Publish product'}</button><button className="team-text-button" type="button" onClick={onClose}>Cancel</button></div>
  </form></dialog>;
}
export default function ProductManager({ workspace, saveWorkspace, customerId }) {
  const [editor, setEditor] = useState(null), [query, setQuery] = useState(''), [status, setStatus] = useState('all'), [notice, setNotice] = useState(''), [page, setPage] = useState(0);
  const pageSize = Math.min(3,useProductPageSize());
  const list = workspace.products.filter(product => (!customerId || !product.customerIds?.length || product.customerIds.includes(customerId)) && (status === 'all' || product.status === status) && `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const current = Math.min(page,Math.max(0,Math.ceil(list.length / pageSize) - 1));
  function archive(product) {
    const nextStatus = product.status === 'archived' ? 'draft' : 'archived';
    try { saveWorkspace({ ...workspace, products: workspace.products.map(item => item.id === product.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item) }); setNotice(nextStatus === 'archived' ? 'Product archived and removed from customer recommendations.' : 'Product restored as a draft. Publish it when ready.'); }
    catch { setNotice('Your browser could not update the product. Please try again.'); }
  }
  return <section><div className="team-section-heading"><div><h2>{customerId ? 'Recommended products' : 'Products & affiliate links'}</h2><p>{customerId ? 'Manage products available to this customer, including shared team picks.' : 'Build your catalogue and choose who sees each recommendation.'}</p></div><button className="team-button" type="button" onClick={() => setEditor(blankProduct(customerId))}>Add product</button></div>
    {notice && <p className="team-feedback" role="status">{notice}</p>}
    <div className="team-toolbar"><label className="team-search"><span className="sr-only">Search team products</span><input type="search" placeholder="Search products" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }}/></label><label className="team-filter">Status<select value={status} onChange={event => { setStatus(event.target.value); setPage(0); }}><option value="all">All products</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div>
    {list.length ? <div className="team-product-list">{list.slice(current * pageSize,(current + 1) * pageSize).map(product => { const link = affiliateLink(product.affiliateUrl); return <article className="team-product-row" key={product.id}><div><span className="team-kicker">{product.category}</span><h3>{product.name}</h3><p>{product.customerIds?.length ? product.customerIds.map(id => sampleCustomers.find(customer => customer.id === id)?.name || 'Customer').join(', ') : 'All customers'}</p></div><div className="team-product-link-status"><span className="team-status">{product.status}</span><small>{link ? `Link ready · ${link.retailer}` : 'Affiliate link needed'}</small></div><div className="team-row-actions"><button type="button" onClick={() => setEditor(product)} aria-label={`Edit ${product.name}`}>Edit</button><button type="button" onClick={() => archive(product)} aria-label={`${product.status === 'archived' ? 'Restore' : 'Archive'} ${product.name}`}>{product.status === 'archived' ? 'Restore draft' : 'Archive'}</button></div></article>; })}</div> : <div className="team-empty"><h3>No products found</h3><p>Add a product or change your search and status filter.</p><button className="team-button team-button-outline" onClick={() => { setQuery(''); setStatus('all'); }}>Clear filters</button></div>}
    <PortalPager page={current} pageSize={pageSize} total={list.length} onChange={setPage}/>
    {editor && <ProductDialog key={editor.id || 'new'} product={editor} workspace={workspace} saveWorkspace={saveWorkspace} onClose={() => setEditor(null)} onSaved={setNotice}/>}
  </section>;
}
