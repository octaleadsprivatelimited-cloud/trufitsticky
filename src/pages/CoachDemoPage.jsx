import { Link, useParams } from 'react-router-dom';
import CoachDetailPage from './CoachDetailPage';
import '../styles/coach-demo.css';

export default function CoachDemoPage() {
  const { coachName } = useParams();
  return <div className="coach-reserve-demo">
    <div className="reserve-demo-notice"><span>Design preview · Coach page concept</span><Link to={`/coaches/${encodeURIComponent(coachName || '')}`}>View current coach page</Link><span>Booking is a UI preview. No payment or request is submitted.</span></div>
    <CoachDetailPage demoMode/>
  </div>;
}
