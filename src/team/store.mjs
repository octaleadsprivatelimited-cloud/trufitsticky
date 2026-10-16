import { demoAccount } from '../portal/data.mjs';
import { emptyProfile, readProfile } from '../portal/profile.mjs';
import { affiliateLink, teamProducts } from '../portal/products.mjs';

const KEY = 'trufit_team_workspace_v1';
export const TEAM_ACCESS_KEY = 'trufit_team_preview_access';
export const WORKSPACE_EVENT = 'trufit:team-workspace';
// Fictional customers only. Alex shares the existing customer's local profile.
export const sampleCustomers = [
  { id: demoAccount.id, name: demoAccount.name, email: demoAccount.email, memberId: demoAccount.memberId, coach: 'Jaswant Medidi', program: '24-week personal coaching', initials: 'AM' },
  { id: 'demo-jamie', name: 'Jamie Rivera', email: 'jamie@example.com', memberId: 'TF-DEMO-1025', coach: 'Srikar Peddapally', program: '12-week personal coaching', initials: 'JR', profile: { ...emptyProfile, weight: '64', height: '168', goal: 'Improve fitness', experience: 'Just starting', activity: 'Some daily movement', trainingLocation: 'Home', trainingDays: '3', equipment: 'Sample: training mat', dietPreference: 'Vegetarian', meals: '3', allergies: 'Sample: none', avoidFoods: 'Sample: mushrooms', notes: 'Fictional customer profile for the team preview.' } },
  { id: 'demo-taylor', name: 'Taylor Kim', email: 'taylor@example.com', memberId: 'TF-DEMO-1026', coach: 'Jaswant Medidi', program: '24-week personal coaching', initials: 'TK', profile: { ...emptyProfile } },
];
export function customerProfile(customer) { return customer.id === demoAccount.id ? readProfile().values : { ...emptyProfile, ...customer.profile }; }
export function initialWorkspace() { return { version: 1, diets: {}, products: teamProducts.map(product => ({ ...product, status: 'draft', customerIds: [], updatedAt: null })) }; }
export function readWorkspace() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(KEY));
    if (stored?.version === 1 && stored.diets && typeof stored.diets === 'object' && Array.isArray(stored.products)) return stored;
  } catch { /* Start the local workspace with sample customers and example drafts. */ }
  return initialWorkspace();
}
export function writeWorkspace(workspace) {
  sessionStorage.setItem(KEY, JSON.stringify(workspace));
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
}
export function blankDiet() { return { title: '', startDate: '', reviewDate: '', notes: '', meals: [{ id: 'breakfast', label: 'Breakfast', time: '', food: '' }, { id: 'lunch', label: 'Lunch', time: '', food: '' }, { id: 'dinner', label: 'Dinner', time: '', food: '' }] }; }
export function validateDiet(plan) {
  if (!plan.title.trim()) return 'Add a diet plan title before publishing.';
  if (!plan.meals.length || plan.meals.some(meal => !meal.label.trim() || !meal.food.trim())) return 'Give every meal a name and food or portion guidance before publishing.';
  if (plan.startDate && plan.reviewDate && plan.reviewDate < plan.startDate) return 'The review date must be on or after the start date.';
  return '';
}
export function updateDiet(workspace, customerId, plan, publish = false) {
  const now = new Date().toISOString(), previous = workspace.diets[customerId] || {};
  const record = { ...previous, draft: structuredClone(plan), updatedAt: now, ...(publish ? { published: structuredClone(plan), publishedAt: now } : {}) };
  return { ...workspace, diets: { ...workspace.diets, [customerId]: record } };
}
export function publishedProducts(workspace, customerId) {
  return workspace.products.filter(product => product.status === 'published' && affiliateLink(product.affiliateUrl) && (!product.customerIds?.length || product.customerIds.includes(customerId)));
}
export function blankProduct(customerId) { return { id: '', name: '', category: 'Strength', icon: 'bands', description: '', note: '', affiliateUrl: '', status: 'draft', customerIds: customerId ? [customerId] : [], isPreview: false }; }
export function validateProduct(product, publish) {
  if (!product.name.trim()) return 'Add a product name.';
  if (!product.description.trim()) return 'Add a short product description.';
  if ((publish || product.affiliateUrl.trim()) && !affiliateLink(product.affiliateUrl.trim())) return 'Enter a valid HTTPS affiliate link without a username or password.';
  return '';
}
export function updateProduct(workspace, product, publish) {
  const next = { ...product, name: product.name.trim(), affiliateUrl: product.affiliateUrl.trim(), id: product.id || crypto.randomUUID(), status: publish ? 'published' : 'draft', isPreview: false, updatedAt: new Date().toISOString() };
  return { ...workspace, products: workspace.products.some(item => item.id === next.id) ? workspace.products.map(item => item.id === next.id ? next : item) : [...workspace.products, next] };
}
export function formatTeamDate(value) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }).format(date) + ' IST' : 'Not yet saved';
}
