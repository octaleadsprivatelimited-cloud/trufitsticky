import test from 'node:test';
import assert from 'node:assert/strict';
import { bmiGuidance } from './guidance.mjs';
import { coachMatchesFocus, normalizeCoachFocus, coachFocusLink } from '../components/coaches/focus.mjs';

test('each BMI category has basic guidance and an available coaching focus', () => {
  for (const key of ['underweight', 'healthy', 'overweight', 'obesity']) {
    const item = bmiGuidance(key);
    assert.equal(item.tips.length, 3);
    assert.notEqual(normalizeCoachFocus(item.goal), 'all');
    assert.equal(item.link, coachFocusLink(item.goal));
    const url = new URL(item.link, 'https://www.betrufit.com');
    assert.equal(url.pathname, '/coaches');
    assert.deepEqual([...url.searchParams.keys()], ['focus']);
    assert.ok(item.source.url.startsWith('https://'));
  }
  assert.equal(bmiGuidance('unknown').tips.length, 0);
});
test('coach matching uses listed specialties without inferring medical qualifications', () => {
  assert.equal(coachMatchesFocus({ specializations: 'Fat Loss & Body Recomposition, Strength Training' }, 'weight-loss'), true);
  assert.equal(coachMatchesFocus({ specializations: 'Nutrition Coaching, Habit Formation' }, 'nutrition'), true);
  assert.equal(coachMatchesFocus({ specializations: 'Weight Loss' }, 'nutrition'), false);
  assert.equal(coachMatchesFocus({ specializations: 'PCOS Management' }, 'nutrition'), false);
  assert.equal(normalizeCoachFocus('diabetes'), 'all');
  assert.equal(normalizeCoachFocus('https://example.com'), 'all');
  assert.equal(coachFocusLink('weight loss'), '/coaches?focus=weight-loss');
});
