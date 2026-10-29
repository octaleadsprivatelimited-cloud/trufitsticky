// Adult categories: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
export const BMI_SOURCE = 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html';

function measurement(value, minimum, maximum, label, unit) {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') {
    throw new Error(`Enter your ${label.toLowerCase()}.`);
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new Error(`${label} must be between ${minimum} and ${maximum} ${unit}.`);
  }
  return number;
}

export function calculateBmi({ weightKg, heightCm, adult } = {}) {
  if (adult !== true) throw new Error('This calculator is for adults aged 20 and older. Please confirm your age group.');
  const weight = measurement(weightKg, 20, 500, 'Weight', 'kg');
  const height = measurement(heightCm, 100, 250, 'Height', 'cm');
  // Classify the displayed one-decimal value so boundary results are consistent.
  const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));
  const category = bmi < 18.5 ? { key: 'underweight', label: 'Underweight' }
    : bmi < 25 ? { key: 'healthy', label: 'Healthy weight' }
    : bmi < 30 ? { key: 'overweight', label: 'Overweight' }
    : { key: 'obesity', label: 'Obesity' };
  return { bmi, category, weightKg: weight, heightCm: height };
}
