export const demoAccount = {
  id: 'demo-member', name: 'Bheemesh', email: 'alex@example.com', memberId: 'TF-DEMO-1024', joinedAt: '2026-04-12', timezone: 'Asia/Kolkata',
  programs: [
    { id: 'program-24', name: 'Personal coaching', description: 'A little structure. A stronger everyday.', durationWeeks: 24, startDate: '2026-07-12', endDate: '2026-12-26', status: 'active', coach: 'Jaswant Medidi', coachSlug: 'jaswant-medidi', focus: ['Personalized training', 'Nutrition guidance', 'Weekly check-ins'], invoiceId: 'TF-DEMO-002' },
    { id: 'program-12', name: 'Your foundation program', description: 'Your first chapter of consistent movement.', durationWeeks: 12, startDate: '2026-04-12', endDate: '2026-07-04', status: 'completed', coach: 'Jaswant Medidi', coachSlug: 'jaswant-medidi', focus: ['Building a routine', 'Training fundamentals', 'Everyday nutrition'], invoiceId: 'TF-DEMO-001' },
  ],
  invoices: [
    { id: 'TF-DEMO-002', issuedAt: '2026-07-12', paidAt: '2026-07-12', description: 'Personal coaching · 24-week program', amountMinor: 2500000, currency: 'INR', status: 'paid', method: 'UPI', reference: 'DEMO-PAY-002', programId: 'program-24' },
    { id: 'TF-DEMO-001', issuedAt: '2026-04-12', paidAt: '2026-04-12', description: 'Foundation coaching · 12-week program', amountMinor: 1400000, currency: 'INR', status: 'paid', method: 'Card', reference: 'DEMO-PAY-001', programId: 'program-12' },
  ],
  referrals: {
    code: 'ALEX-TRUFIT',
    entries: [
      { id: 'r1', name: 'Jamie R.', date: '2026-09-24', status: 'joined' },
      { id: 'r2', name: 'Sam K.', date: '2026-10-02', status: 'joined' },
      { id: 'r3', name: 'Taylor P.', date: '2026-10-09', status: 'invited' },
    ],
  },
};

export const demoInitials = demoAccount.name.split(/\s+/).map(part => part[0]).slice(0,2).join('');

// Configure the reward copy here once the business defines the program.
// These are presentation settings; the UI never issues or promises credits.
export const referralConfig = {
  enabled: false,
  headline: 'A little encouragement goes a long way.',
  rewardTitle: 'Your next good thing.',
  rewardDescription: 'Referral rewards are being finalized. We’ll share the benefit and eligibility details here when the program launches.',
  terms: 'Rewards, qualifying programs, and eligibility will be confirmed before launch. Sample activity does not create a reward or credit.',
};

const DAY = 86400000;
function calendarDay(value, timezone = 'Asia/Kolkata') {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date.getTime() / DAY : null;
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = type => parts.find(item => item.type === type)?.value;
  return Date.UTC(Number(part('year')), Number(part('month')) - 1, Number(part('day'))) / DAY;
}
export function daysSince(start, now = new Date(), timezone = 'Asia/Kolkata') {
  const from = calendarDay(start, timezone), to = calendarDay(now, timezone);
  return from == null || to == null ? 0 : Math.max(0, to - from + 1);
}
export function programProgress(program, now = new Date(), timezone = 'Asia/Kolkata') {
  const total = daysSince(program.startDate, program.endDate, timezone);
  const elapsed = Math.min(total, daysSince(program.startDate, now, timezone));
  return { total, elapsed, remaining: Math.max(0, total - elapsed), percent: total ? Math.min(100, Math.round(elapsed / total * 100)) : 0 };
}
export function formatDate(value) {
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date) : 'Not available';
}
export function formatMoney(amountMinor, currency = 'INR') {
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits;
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, maximumFractionDigits: digits }).format(amountMinor / (10 ** digits));
}
export function invoiceFilename(invoice) {
  return `${String(invoice.id).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 100)}.pdf`;
}
