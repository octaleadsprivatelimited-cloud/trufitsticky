export const coachLandings = {
 'jaswant-medidi': {
  name: 'Jaswant Medidi', headline: ['Less guesswork.', 'More progress.'],
  audience: 'For busy people ready to build a routine that lasts.',
  journey: '40 kg', journeyLabel: 'lost in his own fitness journey',
  storyTitle: 'He has been at your starting point.',
  pitchTitle: 'Give your effort a plan worth following.',
  pitch: 'You’ve made the decision to get fitter before. This time, give yourself structure: a routine you understand, food that fits your life, and a coach to help you keep going when the first burst of motivation fades.',
  shifts: [
   ['Saving workouts. Still unsure what to do.', 'A training plan built around your starting point.'],
   ['Changing diets. Struggling to stay consistent.', 'Nutrition guidance shaped around your preferences.'],
   ['Losing momentum when life gets busy.', 'Check-ins to review, adjust, and keep moving.'],
  ],
 },
 'srikar-peddapally': {
  name: 'Srikar Peddapally', headline: ['Busy workdays.', 'Stronger everyday.'],
  audience: 'For working professionals who want fitness to fit real life.',
  journey: '50+ kg', journeyLabel: 'lost while working full-time',
  storyTitle: 'A coach who understands a full calendar.',
  pitchTitle: 'Your calendar is full. Your goals still matter.',
  pitch: 'Waiting for a quieter month can keep moving your goals further away. Start with a plan for the life you have now: practical training, flexible nutrition guidance, and a coach who understands working full-time.',
  shifts: [
   ['Waiting for the perfect time to start.', 'Training built around the time you can commit.'],
   ['Guessing how to balance food and fitness.', 'Nutrition guidance that considers your routine.'],
   ['A busy week turns into a long break.', 'Regular reviews to help adapt your next steps.'],
  ],
 },
};
export const landingSeoPages = Object.fromEntries(Object.entries(coachLandings).map(([slug, coach]) => [
 `/lp/${slug}`, { title: `Train with ${coach.name} — Plans & Booking | Tru Fit`, heading: `Personal coaching with ${coach.name}`, description: `Meet ${coach.name}, explore personalized coaching, compare INR and USD plans, and take your next step with Tru Fit.` },
]));
