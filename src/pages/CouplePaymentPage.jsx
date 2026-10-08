import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { coupleRequest } from "../components/coaches/coupleApi";
import "../components/coaches/couplePlans.css";

export default function CouplePaymentPage() {
  const [params] = useSearchParams();
  const id = params.get("enrollment_id");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let tries = 0;
    const token = id ? sessionStorage.getItem(`couple:${id}`) : null;
    async function check() {
      if (!id || !token) { setError("Please use the browser where you started checkout, or contact support with your order reference."); return; }
      setBusy(true);
      try {
        const data = await coupleRequest(`couple-checkout/${encodeURIComponent(id)}/status/`, { token }, controller.signal);
        if (controller.signal.aborted) return;
        setResult(data);
        setError("");
        // Bounded checks — a page left open cannot poll indefinitely.
        if (data.status === "pending" && ++tries < 3) timer = setTimeout(check, 6000);
      } catch (failure) { if (!controller.signal.aborted) setError(failure.message); }
      finally { if (!controller.signal.aborted) setBusy(false); }
    }
    check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [id, attempt]);

  const paid = result?.status === "paid";
  const review = result?.status === "review";
  return <main className="couple-status">
    <p className="couple-eyebrow">Couple coaching</p>
    <h1>{paid ? "You’re both enrolled." : review ? "Your payment needs a review." : "Checking your payment"}</h1>
    {error && <p className="couple-error" role="alert">{error}</p>}
    {paid ? <p role="status">Your shared start date is {result.start_date}. Each participant will receive their own onboarding email. Please check both inboxes.</p>
      : review ? <p role="status">We’ve received a payment notification, but cannot activate the program yet. Please contact support with the reference below. Do not pay again.</p>
      : result?.status === "expired" ? <p role="status">Your slot reservation has expired. If you were debited, check again or contact support before starting a new purchase.</p>
      : <p role="status">{busy ? "Confirming securely with the payment provider…" : "Payment has not been confirmed yet. If you were debited, do not make another payment."}</p>}
    {id && <p className="couple-reference">Enrollment reference: {id}{result?.order_id && <><br />Payment reference: {result.order_id}</>}</p>}
    {!paid && !review && <button type="button" className="couple-primary" disabled={busy} onClick={() => setAttempt(current => current + 1)}>Check again</button>}
    <p><a href="mailto:support@betrufit.com">Contact support</a> · <Link to="/coaches">Browse coaches</Link></p>
  </main>;
}
