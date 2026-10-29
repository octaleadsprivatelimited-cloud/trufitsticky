import { coachFocusLink } from '../components/coaches/focus.mjs';

const nhsGain = { title: 'NHS: healthy ways to gain weight', url: 'https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/healthy-ways-to-gain-weight/' };
const nhsEating = { title: 'NHS: balanced eating habits', url: 'https://www.nhs.uk/better-health/lose-weight/healthy-eating-when-trying-to-lose-weight/' };
const cdcHabits = { title: 'CDC: food and activity habits', url: 'https://www.cdc.gov/healthy-weight-growth/about/tips-for-balancing-food-activity.html' };

const guidance = {
  underweight: {
    title: 'Build steady nutrition habits.',
    tips: ['Eat regular, balanced meals and include snacks if helpful.', 'Include protein foods such as beans, eggs, dairy or suitable alternatives.', 'Speak with a healthcare professional if you have lost weight unexpectedly.'],
    goal: 'nutrition', coachFocus: 'Nutrition coaching', source: nhsGain,
  },
  healthy: {
    title: 'Keep the habits that work.',
    tips: ['Enjoy a variety of foods and regular, balanced meals.', 'Keep everyday movement and strength activities in your routine.', 'Choose habits you can maintain rather than chasing a lower number.'],
    goal: 'habit', coachFocus: 'Healthy habits', source: cdcHabits,
  },
  overweight: {
    title: 'Start with manageable changes.',
    tips: ['Build balanced meals around vegetables, protein foods and whole grains.', 'Choose movement you enjoy and build up gradually.', 'Focus on consistent habits instead of restrictive or crash diets.'],
    goal: 'weight loss', coachFocus: 'Weight management', source: nhsEating,
  },
  obesity: {
    title: 'Build a supported starting point.',
    tips: ['Start with regular, balanced meals and comfortable everyday movement.', 'Choose small changes you can repeat.', 'Discuss new exercise or weight goals with a healthcare professional, especially if you have existing health conditions.'],
    goal: 'nutrition', coachFocus: 'Nutrition coaching', source: cdcHabits,
  },
  general: {
    title: 'Choose support for your goal.',
    tips: [], goal: 'habit', coachFocus: 'Healthy habits', source: cdcHabits,
  },
};

export function bmiGuidance(categoryKey) {
  const item = Object.hasOwn(guidance, categoryKey) ? guidance[categoryKey] : guidance.general;
  return { ...item, tips: [...item.tips], source: { ...item.source }, link: coachFocusLink(item.goal) };
}
