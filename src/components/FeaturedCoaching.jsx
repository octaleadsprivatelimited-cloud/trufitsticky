import { Link } from 'react-router-dom';
import { coachLandings } from '../content/coachLandings.mjs';
import '../styles/featured-coaching.css';

export default function FeaturedCoaching({ standalone = false }) {
 return <section className={`featured-coaching wrap ${standalone ? 'featured-coaching-index' : ''}`} aria-labelledby="featured-coaching-title">
  <div className="section-heading"><div><p className="eyebrow">Find your starting point</p>{standalone ? <h1 id="featured-coaching-title">Your next chapter.<br/><em>Your kind of coach.</em></h1> : <h2 id="featured-coaching-title">A LITTLE SUPPORT.<br/><em>A NEW DIRECTION.</em></h2>}</div><p>Meet two coaches who have been through their own transformations. Explore their approach, compare plans, and take your next step.</p></div>
  <div className="featured-coaching-grid">{Object.entries(coachLandings).map(([slug, coach], index) => <Link className={`featured-coaching-card featured-coaching-card-${index}`} key={slug} to={`/lp/${slug}`} data-track="cta_click" data-source="featured_coaching"><span className="featured-coaching-kicker">{index === 0 ? 'Build lasting habits' : 'Make fitness fit work'}</span><h3>{coach.name}</h3><p>{coach.audience}</p><div><span><strong>{coach.journey}</strong> · his own journey</span><span className="featured-coaching-arrow" aria-hidden="true">↗</span></div><span className="featured-coaching-link">Meet your coach & explore plans ↗</span></Link>)}</div>
  <div className="featured-coaching-bottom"><p>Prefer to explore everyone?</p><Link className="text-link" to="/coaches">Browse all coaches ↗</Link><Link className="text-link" to="/findmycoach">Find my match ↗</Link></div>
 </section>;
}
