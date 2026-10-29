// Rounded Mifflin–St Jeor coefficients; activity bands from FAO/WHO/UNU.
export const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Mostly seated / light activity', description: 'A mainly seated day with light everyday movement.', min: 1.4, max: 1.69 },
  { key: 'moderate', label: 'Moderately active', description: 'Regular movement through the day and some active work or leisure.', min: 1.7, max: 1.99 },
  { key: 'active', label: 'Very active', description: 'Physically demanding work or a highly active daily routine.', min: 2, max: 2.4 },
];

function numberIn(value, min, max, label) {
  if (!['string', 'number'].includes(typeof value) || String(value).trim() === '') throw new Error(`Enter your ${label.toLowerCase()}.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(`${label} must be between ${min} and ${max}.`);
  return number;
}
const nearestTen = value => Math.round(value / 10) * 10;

export function calculateCalories({ weightKg, heightCm, age, sex, activity, eligible } = {}) {
  if (eligible !== true) throw new Error('Confirm that you are an adult and are not pregnant or breastfeeding.');
  const weight = numberIn(weightKg, 20, 500, 'Weight in kg');
  const height = numberIn(heightCm, 100, 250, 'Height in cm');
  const years = numberIn(age, 18, 80, 'Age');
  if (!Number.isInteger(years)) throw new Error('Enter your age in whole years.');
  if (!['male', 'female'].includes(sex)) throw new Error('Choose the sex used for the equation.');
  const level = ACTIVITY_LEVELS.find(item => item.key === activity);
  if (!level) throw new Error('Choose your activity level.');
  if (weight / ((height / 100) ** 2) < 18.5) throw new Error('This calculator is not suitable for a low BMI. A qualified healthcare professional or registered dietitian can help estimate your individual needs.');
  const resting = 10 * weight + 6.25 * height - 5 * years + (sex === 'male' ? 5 : -161);
  return {
    restingCalories: Math.round(resting),
    maintenanceCalories: nearestTen(resting * (level.min + level.max) / 2),
    maintenanceMin: nearestTen(resting * level.min),
    maintenanceMax: nearestTen(resting * level.max),
    activityLabel: level.label,
    weightKg: weight, heightCm: height, age: years, sex,
  };
}
