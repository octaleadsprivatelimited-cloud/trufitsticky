import { useState } from 'react';
import PortalPageHero from './PortalPageHero';
import { PortalDialog, PortalPager } from './CompactControls';
import useProductPageSize from './useProductPageSize';
import { affiliateLink, teamProducts } from './products.mjs';
import './member-wellness.css';
import useWorkspace from '../team/useWorkspace';
import { publishedProducts } from '../team/store.mjs';
import { demoAccount } from './data.mjs';

const KIT_KEY = 'trufit_demo_kit_v1';
const shapes = {
  bands: <><path d="M24 32c0-9 12-15 24-15s24 6 24 15-12 15-24 15-24-6-24-15Z"/><path d="M24 32v20c0 9 12 15 24 15s24-6 24-15V32 M24 43c0 9 12 15 24 15s24-6 24-15"/></>,
  mat: <><path d="M23 29h40c8 0 13 6 13 13S71 55 63 55H23c-8 0-13 6-13 13s5 13 13 13h40"/><path d="M23 29c-8 0-13 6-13 13s5 13 13 13 M23 36c-4 0-6 3-6 6s2 6 6 6 M63 55v26 M33 37h27 M33 44h27"/></>,
  weights: <><path d="M22 37h10v22H22z M13 41h9v14h-9z M64 37h10v22H64z M74 41h9v14h-9z M32 44h32v8H32z"/></>,
  bottle: <><path d="M39 14h18v12H39z M37 26h22v9l5 9v34a5 5 0 0 1-5 5H37a5 5 0 0 1-5-5V44l5-9z M32 50h32 M32 67h32 M44 33h8"/></>,
};
function ProductArt({ name }) { return <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name] || shapes.bands}</svg>; }
function readKit() {
  try { const stored = JSON.parse(sessionStorage.getItem(KIT_KEY)); return Array.isArray(stored) ? stored.filter(id => typeof id === 'string') : []; }
  catch { return []; }
}
export default function TrainingProducts() {
  const [workspace] = useWorkspace();
  const pageSize = useProductPageSize();
  const assigned = publishedProducts(workspace,demoAccount.id);
  const hasManagedProducts = workspace.products.some(product => product.updatedAt);
  const catalogue = assigned.length || hasManagedProducts ? assigned : teamProducts;
  const [category,setCategory] = useState('All'), [query,setQuery] = useState(''), [page,setPage] = useState(0);
  const [owned,setOwned] = useState(readKit), [notice,setNotice] = useState(''), [detail,setDetail] = useState(null);
  const categories = ['All',...new Set(catalogue.map(product => product.category))];
  const products = catalogue.filter(product => (category === 'All' || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const current = Math.min(page,Math.max(0,Math.ceil(products.length/pageSize)-1));
  function toggleOwned(id) {
    const updated = owned.includes(id) ? owned.filter(item => item !== id) : [...owned,id]; setOwned(updated);
    try { sessionStorage.setItem(KIT_KEY,JSON.stringify(updated)); setNotice('Kit saved in this tab.'); }
    catch { setNotice('Your browser could not save this kit update.'); }
  }
  function buy(product) {
    const link = affiliateLink(product.affiliateUrl);
    return link ? <a className="portal-button portal-button-outline" href={link.href} target="_blank" rel="sponsored noopener noreferrer">View product<span className="sr-only"> on {link.retailer}, opens in a new tab</span></a> : <button className="portal-button portal-button-outline" type="button" disabled>Link coming soon</button>;
  }
  return <div className="member-wellness compact-products portal-subpage"><PortalPageHero type="products" title="Your training kit" description="A few essentials. Picked for your progress."/><div className="portal-page-toolbar"><span>{catalogue.some(product => !product.isPreview) ? 'Selected by your Tru Fit team' : 'Example products · Affiliate links pending'}</span></div><div className="compact-product-toolbar"><label className="compact-product-category"><span className="sr-only">Product category</span><select value={category} onChange={event => { setCategory(event.target.value); setPage(0); }}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label className="compact-search"><span className="sr-only">Search training products</span><input type="search" placeholder="Search products" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }}/></label></div><div className="compact-product-count"><span>{products.length} products · {owned.filter(id => catalogue.some(product => product.id === id)).length} in your kit</span><span role="status">{notice}</span></div><div className="compact-product-list">{products.slice(current*pageSize,current*pageSize+pageSize).map(product => <article className={`portal-card compact-product ${owned.includes(product.id) ? 'is-owned' : ''}`} key={product.id}><span className="compact-product-art"><ProductArt name={product.icon}/></span><div className="compact-product-info"><span>{product.category}{product.isPreview ? ' · Example' : ''}</span><h3>{product.name}</h3><p>{product.description}</p><button className="portal-quiet-button" type="button" onClick={() => setDetail(product)} aria-label={`Details for ${product.name}`}>Details</button></div><div className="compact-product-actions">{buy(product)}<label><input type="checkbox" checked={owned.includes(product.id)} onChange={() => toggleOwned(product.id)} aria-label={`Mark ${product.name} as already owned`}/><span>In my kit</span></label></div></article>)}</div>{!products.length && <div className="portal-card portal-small-empty"><h3>{catalogue.length ? 'No products found' : 'No products assigned yet'}</h3><p>{catalogue.length ? 'Try another search or category.' : 'Published team recommendations will appear here.'}</p>{catalogue.length > 0 && <button type="button" className="portal-quiet-button" onClick={() => { setQuery(''); setCategory('All'); setPage(0); }}>Show all products</button>}</div>}<PortalPager page={current} pageSize={pageSize} total={products.length} onChange={setPage}/><p className="portal-inline-note">Affiliate links may earn Tru Fit a commission.</p>{detail && <PortalDialog title={detail.name} onClose={() => setDetail(null)}><p>{detail.description}</p><p>{detail.note}</p>{buy(detail)}<p className="portal-inline-note">{affiliateLink(detail.affiliateUrl)?.retailer || 'The team has not added a product link yet.'}</p></PortalDialog>}</div>;
}
