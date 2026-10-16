export const PROFILE_KEY = 'trufit_demo_fitness_profile_v1';
export const emptyProfile = {
  weight: '', height: '', targetWeight: '', goal: '', experience: '', activity: '',
  trainingLocation: '', trainingDays: '', equipment: '', limitations: '',
  dietPreference: '', meals: '', allergies: '', avoidFoods: '', usualMeals: '',
  water: '', sleep: '', notes: '',
};
export function readProfile() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(PROFILE_KEY));
    if (saved?.version === 1 && saved.values && typeof saved.values === 'object') {
      return { values: Object.fromEntries(Object.keys(emptyProfile).map(key => [key, typeof saved.values[key] === 'string' ? saved.values[key].slice(0, 1500) : ''])), savedAt: typeof saved.savedAt === 'string' && Number.isFinite(Date.parse(saved.savedAt)) ? saved.savedAt : null };
    }
  } catch { /* An unavailable or invalid store starts with a blank profile. */ }
  return { values: { ...emptyProfile }, savedAt: null };
}
export function saveProfile(values) {
  const record = { version: 1, values, savedAt: new Date().toISOString() };
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(record));
  return record;
}
