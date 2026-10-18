import { Link, useParams } from 'react-router-dom';
import { referralConfig } from '../portal/data.mjs';
import '../styles/customer-portal.css';
export default function ReferralPage() {
  const { code } = useParams();
  const valid = /^[A-Z0-9-]{3,40}$/i.test(code || '');
  return <section className="referral-public wrap"><span className="portal-referral-flower" aria-hidden="true">✳</span><p className="eyebrow">A little encouragement from a friend</p><h1>{valid ? <>Your next chapter.<br/><em>A shared starting point.</em></> : 'This referral link looks incomplete.'}</h1><p>{valid ? 'Someone in your corner thought Tru Fit could be your kind of coaching. Find a coach who listens and a plan that fits your everyday.' : 'Explore our coaches or ask your friend for their full referral link.'}</p>{valid && <div className="referral-public-code"><small>Sample referral code</small><strong>{code}</strong></div>}<div className="button-row"><Link className="button" to="/coaches">Find your coach</Link></div><div className="portal-small-note"><p>This is a referral UI preview. No referral is registered or credited. {referralConfig.terms}</p></div></section>;
}
