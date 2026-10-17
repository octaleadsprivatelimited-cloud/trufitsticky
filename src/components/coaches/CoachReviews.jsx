function Review({ review }) {
  const rating = Number(review.rating);
  return <article className="coaching-review"><header>{review.image_url ? <img src={review.image_url} alt="" loading="lazy"/> : <span className="coaching-review-initial" aria-hidden="true">{review.client_name.charAt(0)}</span>}<div><strong>{review.client_name}</strong>{rating >= 1 && rating <= 5 && <span className="coaching-review-stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(Math.round(rating))}</span>}</div></header><blockquote>{review.body}</blockquote></article>;
}

export default function CoachReviews({ summary, coachName }) {
  const { reviews, rated, average, coachSpecific } = summary;
  return <section id="coach-reviews" className="coaching-reviews" tabIndex={-1} aria-labelledby="coaching-reviews-title">
    <div className="coaching-section-heading"><div><p className="coaching-eyebrow">Member experiences</p><h2 id="coaching-reviews-title">{coachSpecific ? `Reviews for ${coachName.split(' ')[0]}` : 'Tru Fit member reviews'}</h2>{reviews.length > 0 && !coachSpecific && <p>Feedback from across Tru Fit coaching.</p>}</div>{average && <div className="coaching-review-score"><strong>{average}<small>/5</small></strong><span>{rated.length} {rated.length === 1 ? 'rating' : 'ratings'}</span></div>}</div>
    {reviews.length ? <><div className="coaching-review-grid">{reviews.slice(0,3).map((review,index) => <Review key={review.id || index} review={review}/>)}</div>{reviews.length > 3 && <details className="coaching-more-reviews"><summary>Read all {reviews.length} reviews</summary><div className="coaching-review-grid">{reviews.slice(3).map((review,index) => <Review key={review.id || index} review={review}/>)}</div></details>}</> : <p className="coaching-review-empty">Member feedback will appear here as it’s published.</p>}
  </section>;
}
