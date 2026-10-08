/**
 * Cleanup stale payment-related localStorage entries.
 * Entries older than MAX_AGE_MS are automatically removed.
 * Call this on app startup to prevent stale data buildup.
 */

const PAYMENT_PREFIXES = [
  'payment_context_',
  'payment_success_',
];

const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function cleanupStalePaymentData() {
  try {
    const now = Date.now();
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const isPaymentKey = PAYMENT_PREFIXES.some(prefix => key.startsWith(prefix));
      if (!isPaymentKey) continue;

      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.timestamp && (now - data.timestamp > MAX_AGE_MS)) {
            keysToRemove.push(key);
          }
        }
      } catch {
        // If we can't parse it, it's likely stale — remove it
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      if (import.meta.env.DEV) {
        console.log(`[Cleanup] Removed stale entry: ${key}`);
      }
    });

    if (import.meta.env.DEV && keysToRemove.length > 0) {
      console.log(`[Cleanup] Removed ${keysToRemove.length} stale payment entries`);
    }
  } catch (err) {
    // Silently fail — localStorage may not be available
    if (import.meta.env.DEV) {
      console.warn('[Cleanup] localStorage cleanup failed:', err);
    }
  }
}

/**
 * Cleanup stale sessionStorage entries (e.g., form submission guards)
 */
export function cleanupStaleSessionData() {
  try {
    const submittedAt = sessionStorage.getItem('trufit_enquiry_submitted');
    if (submittedAt) {
      const elapsed = Date.now() - parseInt(submittedAt, 10);
      // Remove after 1 hour
      if (elapsed > 60 * 60 * 1000) {
        sessionStorage.removeItem('trufit_enquiry_submitted');
      }
    }
  } catch {
    // Silently fail
  }
}
