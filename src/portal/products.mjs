// Replace these examples with the team's approved products and affiliate URLs.
// Never build recommendation URLs from a member's fitness or diet information.
export const teamProducts = [
  { id: 'resistance-bands', name: 'Resistance bands', category: 'Strength', icon: 'bands', description: 'A compact option for adding resistance to home workouts.', note: 'Ask your coach which resistance level fits your program.', affiliateUrl: '', isPreview: true },
  { id: 'training-mat', name: 'Training mat', category: 'Mobility', icon: 'mat', description: 'A comfortable surface for floor exercises and mobility sessions.', note: 'Look for a size and grip that suit your training space.', affiliateUrl: '', isPreview: true },
  { id: 'dumbbells', name: 'Adjustable dumbbells', category: 'Strength', icon: 'weights', description: 'A flexible way to add different loads to your training setup.', note: 'Confirm the weight range with your coach before buying.', affiliateUrl: '', isPreview: true },
  { id: 'water-bottle', name: 'Reusable water bottle', category: 'Everyday', icon: 'bottle', description: 'Keep water close by during workouts and throughout your day.', note: 'Choose something easy to carry, refill, and clean.', affiliateUrl: '', isPreview: true },
];

export function affiliateLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? { href: url.href, retailer: url.hostname.replace(/^www\./, '') } : null;
  } catch { return null; }
}
