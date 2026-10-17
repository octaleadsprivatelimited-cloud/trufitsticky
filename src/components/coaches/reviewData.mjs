export function reviewSummary(testimonials, coachId) {
  const published = (Array.isArray(testimonials) ? testimonials : []).filter(review => typeof review?.body === 'string' && review.body.trim() && typeof review.client_name === 'string' && review.client_name.trim());
  const own = published.filter(review => String(review.coach_id ?? review.coach?.id ?? review.coach) === String(coachId));
  const reviews = own.length ? own : published;
  const rated = reviews.filter(review => Number(review.rating) >= 1 && Number(review.rating) <= 5);
  const average = rated.length ? (rated.reduce((sum, review) => sum + Number(review.rating), 0) / rated.length).toFixed(1) : null;
  return { reviews, rated, average, coachSpecific:own.length > 0 };
}
