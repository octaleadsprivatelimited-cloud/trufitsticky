import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewSummary } from './reviewData.mjs';

const review = (coach_id, rating, body = 'Helpful coaching.') => ({ coach_id, rating, body, client_name:'Sample member' });
test('coach reviews match numeric and nested IDs without attributing another coach’s rating', () => {
 const result = reviewSummary([review('12',5),{ ...review(null,4),coach:{ id:12 } },review(30,1)],12);
 assert.equal(result.coachSpecific,true);
 assert.equal(result.reviews.length,2);
 assert.equal(result.average,'4.5');
});
test('the community fallback is labelled separately from coach-specific feedback', () => {
 const result = reviewSummary([review(30,5),review(31,3)],12);
 assert.equal(result.coachSpecific,false);
 assert.equal(result.reviews.length,2);
 assert.equal(result.average,'4.0');
});
test('missing content and invalid ratings cannot create ratings or testimonials', () => {
 const result = reviewSummary([null,review(12,5,' '),{...review(12,5),client_name:''},review(12,0),review(12,6),review(12,'bad')],12);
 assert.equal(result.reviews.length,3);
 assert.equal(result.rated.length,0);
 assert.equal(result.average,null);
});
test('an empty or unavailable feed produces no fabricated social proof', () => {
 for (const feed of [[],null,{}]) {
  const result = reviewSummary(feed,12);
  assert.deepEqual(result.reviews,[]);
  assert.equal(result.average,null);
  assert.equal(result.coachSpecific,false);
 }
});
