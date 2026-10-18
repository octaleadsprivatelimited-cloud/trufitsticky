import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { sampleCustomers, customerProfile } from '../team/store.mjs';
import useWorkspace from '../team/useWorkspace';
import { Customers, CustomerDetail } from '../team/CustomerViews';
import { assignedCustomers, workspaceCoaches } from '../workspace/coaches.mjs';
import WorkspaceShell, { WorkspaceAccess } from '../workspace/WorkspaceShell';
const ACCESS='trufit_coach_preview_access';
function readAccess(){try{return sessionStorage.getItem(ACCESS)==='demo';}catch{return false;}}
export default function CoachWorkspacePage(){
  const {coachSlug,customerId}=useParams(), {pathname}=useLocation(), navigate=useNavigate();
  const [selected,setSelected]=useState(coachSlug || workspaceCoaches[0].slug), [access,setAccess]=useState(readAccess);
  const [workspace,saveWorkspace]=useWorkspace();
  const coach=workspaceCoaches.find(c=>c.slug===coachSlug);
  function enter(){try{sessionStorage.setItem(ACCESS,'demo');}catch{/* Local UI preview. */}setAccess(true);navigate(`/coach/${selected}`);}
  function leave(){try{sessionStorage.removeItem(ACCESS);}catch{/* Clear memory too. */}setAccess(false);}
  if(!access||!coachSlug)return <WorkspaceAccess coach onEnter={enter}><label className="team-field">Preview as<select value={selected} onChange={e=>setSelected(e.target.value)}>{workspaceCoaches.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label></WorkspaceAccess>;
  if(!coach)return <div className="team-access-page"><h1>Coach preview not found</h1><Link to="/coach">Choose a coach</Link></div>;
  const all=sampleCustomers.map(c=>({...c,profileValues:customerProfile(c)}));
  const customers=assignedCustomers(all,workspace,coach.slug).map(c=>({...c,coach:coach.name}));
  const customer=customers.find(c=>c.id===customerId);
  const base=`/coach/${coach.slug}`;
  const needsDiet=customers.filter(c=>!workspace.diets[c.id]?.published);
  const links=[{to:base,label:'Overview',icon:'overview',end:true},{to:base+'/customers',label:'My customers',icon:'customers'},{to:'/coach',label:'Switch coach',icon:'coaches',end:true}];
  return <WorkspaceShell coach={coach} title={customerId?'Customer record':pathname.endsWith('/customers')?'My customers':'My coaching day'} links={links} onLeave={leave} roleControl={<Link className="workspace-role-switch" to="/coach">Switch coach</Link>}>{customerId ? customer ? <CustomerDetail key={customer.id} customer={customer} workspace={workspace} saveWorkspace={saveWorkspace} basePath={base+'/customers'}/> : <div className="team-empty"><h1>Customer unavailable</h1><p>This sample customer isn’t assigned to {coach.name}.</p><Link className="team-button" to={base+'/customers'}>My customers</Link></div> : pathname.endsWith('/customers') ? <Customers customers={customers} workspace={workspace} basePath={base+'/customers'}/> : <><header className="team-hero workspace-hero"><div><span className="team-kicker">Your coaching day</span><h1>Hi, {coach.name.split(' ')[0]}. Let’s make it count.</h1><p>Personal guidance starts with a clear view of your people.</p></div><span className="workspace-hero-initials" aria-hidden="true">{coach.initials}</span></header><div className="workspace-metrics"><div><span>My sample customers</span><strong>{customers.length}</strong></div><div><span>Plans to prepare</span><strong>{needsDiet.length}</strong></div><div><span>Diet plans published</span><strong>{customers.length-needsDiet.length}</strong></div></div><div className="workspace-dashboard-grid"><section className="team-card"><div className="team-section-heading"><div><h2>{needsDiet.length?'Ready for your guidance':'Your plans are up to date'}</h2><p>Review preferences before preparing a diet plan.</p></div></div><div className="workspace-task-list">{(needsDiet.length?needsDiet:customers).map(c=><Link key={c.id} to={`${base}/customers/${c.id}`}><span className="team-avatar">{c.initials}</span><div><strong>{c.name}</strong><p>{c.profileValues.goal||'Goal not provided'}</p></div><span className="workspace-text-link">Open</span></Link>)}{!customers.length&&<div className="team-empty"><p>No customers assigned in this preview.</p></div>}</div></section><section className="team-card workspace-coach-focus"><span className="workspace-focus-symbol" aria-hidden="true">✳</span><h2>Every detail helps.</h2><p>Review a customer’s fitness details, food preferences, and existing equipment before you update their plan.</p><Link className="team-button" to={base+'/customers'}>View my customers</Link><Link className="workspace-text-link" to={`/coaches/${coach.slug}`}>My public coach profile</Link></section></div></>}</WorkspaceShell>;
}
