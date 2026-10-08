const endpoint = `${import.meta.env.VITE_BASE_URL}/admin_functions`;

export async function coupleRequest(path, body, signal) {
  const response = await fetch(`${endpoint}/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal,
  });
  const data = await response.json();
  if (!response.ok) {
    const message = typeof data.error === "string" ? data.error
      : typeof data.detail === "string" ? data.detail
      : Object.values(data).flat().filter(value => typeof value === "string").join(" ");
    const error = new Error(message || "Unable to complete this request. Please try again.");
    error.data = data;
    throw error;
  }
  return data;
}

const scripts = new Map();
export function loadPaymentSdk(gateway) {
  if (gateway === "cashfree" ? window.Cashfree : window.Razorpay) return Promise.resolve();
  if (scripts.has(gateway)) return scripts.get(gateway);
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = gateway === "cashfree" ? "https://sdk.cashfree.com/js/v3/cashfree.js"
      : "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => { scripts.delete(gateway); script.remove(); reject(new Error("Payment checkout could not load. Please check your connection.")); };
    document.head.appendChild(script);
  });
  scripts.set(gateway, promise);
  return promise;
}
