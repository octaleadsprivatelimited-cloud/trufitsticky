export const coachLandings = {
 'jaswant-medidi': {
  name: 'Jaswant Medidi', headline: ['Less guesswork.', 'More progress.'],
  audience: 'For busy people ready to build a routine that lasts.',
  journey: '40 kg', journeyLabel: 'lost in his own fitness journey',
  storyTitle: 'He has been at your starting point.',
 },
 'srikar-peddapally': {
  name: 'Srikar Peddapally', headline: ['Busy workdays.', 'Stronger everyday.'],
  audience: 'For working professionals who want fitness to fit real life.',
  journey: '50+ kg', journeyLabel: 'lost while working full-time',
  storyTitle: 'A coach who understands a full calendar.',
 },
};
export const landingSeoPages = Object.fromEntries(Object.entries(coachLandings).map(([slug, coach]) => [
 `/start/${slug}`, { title: `Train with ${coach.name} — Plans & Booking | Tru Fit`, heading: `Personal coaching with ${coach.name}`, description: `Meet ${coach.name}, explore personalized coaching, compare INR and USD plans, and take your next step with Tru Fit.` },
]));
