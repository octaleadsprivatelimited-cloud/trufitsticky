import { useState } from 'react';
import './coachReviewCards.css';

const demoStories = [
  { id: 'demo-routine', client_name: 'Aarav', body: 'A routine that fits around work makes it easier to show up consistently.' },
  { id: 'demo-nutrition', client_name: 'Meera', body: 'Simple meal ideas help me plan around the food I already enjoy.' },
  { id: 'demo-strength', client_name: 'Rohan', body: 'Clear workout guidance helps me feel more confident about my next session.' },
  { id: 'demo-support', client_name: 'Ananya', body: 'Regular check-ins give me space to ask questions and adjust my routine.' },
].map(story => ({ ...story, demo: true }));

function Review({ review }) {
  const [imageFailed, setImageFailed] = useState(false);
  const rating = Number(review.rating);
  const initials = review.client_name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('');
  return <article className="coaching-review review-showcase-card">
    <div className="review-showcase-visual" aria-hidden="true">{review.image_url && !imageFailed ? <img src={review.image_url} alt="" loading="lazy" onError={() => setImageFailed(true)}/> : <span className="review-showcase-monogram">{initials}</span>}</div>
    <div className="review-showcase-panel"><span className="review-showcase-badge" aria-hidden="true">{initials}</span><header><strong>{review.client_name}</strong>{review.demo && <span className="review-demo-label">Demo story</span>}{rating >= 1 && rating <= 5 && <span className="coaching-review-stars" role="img" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(Math.round(rating))}</span>}</header><blockquote>{review.body}</blockquote></div>
  </article>;
}

export default function CoachReviews({ summary, coachName }) {
  const { reviews: publishedReviews, rated, average, coachSpecific } = summary;
  const isDemo = publishedReviews.length === 0;
  const reviews = isDemo ? demoStories : publishedReviews;
  return <section id="coach-reviews" className="coaching-reviews review-showcase" tabIndex={-1} aria-labelledby="coaching-reviews-title">
    <div className="coaching-section-heading"><div><p className="coaching-eyebrow">Member experiences</p><h2 id="coaching-reviews-title">{isDemo ? 'Demo member stories' : coachSpecific ? `Reviews for ${coachName.split(' ')[0]}` : 'Tru Fit member reviews'}</h2>{isDemo ? <p>Illustrative stories for this preview. Not real member testimonials.</p> : !coachSpecific && <p>Feedback from across Tru Fit coaching.</p>}</div>{average && <div className="coaching-review-score"><strong>{average}<small>/5</small></strong><span>{rated.length} {rated.length === 1 ? 'rating' : 'ratings'}</span></div>}</div>
    <div className="coaching-review-grid review-showcase-grid">{reviews.slice(0,4).map((review,index) => <Review key={review.id || index} review={review}/>)}</div>{reviews.length > 4 && <details className="coaching-more-reviews"><summary>Read all {reviews.length} reviews</summary><div className="coaching-review-grid review-showcase-grid">{reviews.slice(4).map((review,index) => <Review key={review.id || index} review={review}/>)}</div></details>}
  </section>;
}
