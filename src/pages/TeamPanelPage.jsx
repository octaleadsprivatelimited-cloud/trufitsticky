import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { customerProfile, sampleCustomers, TEAM_ACCESS_KEY } from '../team/store.mjs';
import useWorkspace from '../team/useWorkspace';
import ProductManager from '../team/ProductManager';
import { Customers, CustomerDetail } from '../team/CustomerViews';
import { BlogManager, BlogEditor } from '../team/BlogManager';
import WorkspaceDashboard from '../team/WorkspaceDashboard';
import CoachDirectory from '../team/CoachDirectory';
import WorkspaceShell, { WorkspaceAccess } from '../workspace/WorkspaceShell';
function readAccess() {try{return sessionStorage.getItem(TEAM_ACCESS_KEY)==='demo';}catch{return false;}}
const links=[{to:'/team',label:'Overview',icon:'overview',end:true},{to:'/team/customers',label:'Customers',icon:'customers'},{to:'/team/coaches',label:'Coaches',icon:'coaches'},{to:'/team/blog',label:'Blog studio',icon:'blog'},{to:'/team/products',label:'Products',icon:'products'}];
export default function TeamPanelPage() {
  const [access,setAccess]=useState(readAccess);
  const [workspace,saveWorkspace]=useWorkspace();
  const {customerId}=useParams();
  const {pathname}=useLocation();
  const customers=sampleCustomers.map(c=>({...c,coach:workspace.assignments?.[c.id]||c.coach,profileValues:customerProfile(c)}));
  const customer=customers.find(c=>c.id===customerId);
  function enter(){try{sessionStorage.setItem(TEAM_ACCESS_KEY,'demo');}catch{/* In-memory UI preview. */}setAccess(true);}
  function leave(){try{sessionStorage.removeItem(TEAM_ACCESS_KEY);}catch{/* Clear in memory too. */}setAccess(false);}
  if(!access)return <WorkspaceAccess onEnter={enter}/>;
  const title=pathname.includes('/blog/')?'Blog editor':pathname==='/team/blog'?'Blog studio':pathname==='/team/coaches'?'Coaching team':pathname==='/team/products'?'Products & links':customerId?'Customer record':pathname==='/team/customers'?'Customers':'Overview';
  return <WorkspaceShell title={title} links={links} onLeave={leave}>{customerId ? customer ? <CustomerDetail key={customer.id} customer={customer} workspace={workspace} saveWorkspace={saveWorkspace}/> : <div className="team-empty"><h1>Customer not found</h1><Link to="/team/customers">Back to customers</Link></div> : pathname.includes('/team/blog/') ? <BlogEditor/> : pathname==='/team/blog' ? <BlogManager/> : pathname==='/team/coaches' ? <CoachDirectory customers={customers} workspace={workspace} saveWorkspace={saveWorkspace}/> : pathname==='/team/products' ? <><header className="team-hero workspace-hero"><div><span className="team-kicker">Made for their progress</span><h1>Thoughtful essentials.</h1><p>Your products, links, and recommendations in one place.</p></div></header><ProductManager workspace={workspace} saveWorkspace={saveWorkspace}/></> : pathname==='/team/customers' ? <Customers customers={customers} workspace={workspace}/> : <WorkspaceDashboard customers={customers} workspace={workspace}/>}</WorkspaceShell>;
}
