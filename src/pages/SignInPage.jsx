import { Link, Navigate, useSearchParams } from 'react-router-dom';
import AuthCard from '../auth/AuthCard';
import { useAuth } from '../auth/AuthContext';
import Logo from '../assets/logo-original.svg';

export default function SignInPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('returnTo') || '/portal';
  const destination = /^\/portal(?:\/(?:programs|profile|products|referrals|invoices))?$/.test(requested) ? requested : '/portal';
  if (user) return <Navigate to={destination} replace/>;
  return <section className="member-auth-page"><Link className="member-auth-brand" to="/"><img src={Logo} alt=""/>Tru Fit</Link><AuthCard/><Link className="member-auth-back" to="/coaches">Back to coaches</Link></section>;
}
