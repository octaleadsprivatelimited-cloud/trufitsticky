export const COACH_FOCUSES = [
  ['all', 'All coaching', '✦'],
  ['weight loss', 'Weight loss', '↘'],
  ['strength', 'Strength training', ''],
  ['nutrition', 'Nutrition coaching', '◉'],
  ['habit', 'Healthy habits', '✓'],
  ['beginner', 'Beginner fitness', '◎'],
];

export function normalizeCoachFocus(value) {
  const key = String(value || '').toLowerCase().replace(/-/g, ' ').trim();
  return COACH_FOCUSES.some(([focus]) => focus === key) ? key : 'all';
}

export function coachFocusLink(value) {
  const focus = normalizeCoachFocus(value);
  return `/coaches?focus=${encodeURIComponent(focus.replace(/ /g, '-'))}`;
}

export function coachMatchesFocus(coach, value) {
  const focus = normalizeCoachFocus(value);
  const specialties = String(coach.specializations || '').toLowerCase();
  return focus === 'all' || (focus === 'weight loss'
    ? /weight loss|fat loss/.test(specialties)
    : specialties.includes(focus));
}
