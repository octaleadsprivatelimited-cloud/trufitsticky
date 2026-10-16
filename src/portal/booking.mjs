export const DEMO_BOOKING_KEY = 'trufit_demo_booking_v1';
export const SESSION_TIMEZONE = 'Asia/Kolkata';
export const sampleTimes = [
  { value: '09:00', label: '9:00 – 9:20 AM' },
  { value: '12:00', label: '12:00 – 12:20 PM' },
  { value: '18:00', label: '6:00 – 6:20 PM' },
];
export function sampleDates(now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: SESSION_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const base = new Date(`${today}T12:00:00Z`);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(base.getTime() + (index + 1) * 86400000);
    return date.toISOString().slice(0, 10);
  });
}
export function sessionLabel(slot) {
  if (!slot?.date || !sampleTimes.some(item => item.value === slot.time)) return null;
  const date = new Date(`${slot.date}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== slot.date) return null;
  return { date: new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date), time: sampleTimes.find(item => item.value === slot.time).label, timezone: 'India Standard Time (UTC+05:30)' };
}
export function readDemoBooking() {
  try {
    const booking = JSON.parse(sessionStorage.getItem(DEMO_BOOKING_KEY));
    if (booking?.isPreview === true && booking.coachName && sessionLabel(booking.slot)) return booking;
  } catch { /* Missing or malformed preview never becomes a payment confirmation. */ }
  return null;
}
export function saveDemoBooking(booking) {
  const record = { ...booking, isPreview: true, reference: 'TF-DEMO-BOOKING' };
  sessionStorage.setItem(DEMO_BOOKING_KEY, JSON.stringify(record));
  return record;
}
