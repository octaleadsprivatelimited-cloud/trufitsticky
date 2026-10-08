import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { coupleRequest, loadPaymentSdk } from "./coupleApi";
import "./couplePlans.css";
import { trackCoachEvent } from "../../analytics/analytics";

const blankPerson = domestic => ({ name: "", email: "", phone_number: domestic ? "+91" : "+", residence: domestic ? "India" : "" });

export default function CoupleCheckout({ coach, plan, waitlist = false, onClose }) {
  const [waitlistMode, setWaitlistMode] = useState(waitlist);
  const domestic = plan.currency === "INR";
  const [people, setPeople] = useState(() => [blankPerson(domestic), blankPerson(domestic)]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [complete, setComplete] = useState(false);
  const dialog = useRef(null);
  const errorRef = useRef(null);
  const checkoutKey = useRef(crypto.randomUUID());
  const formId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  const update = (index, field, value) => {
    setPeople(current => current.map((person, i) => i === index ? { ...person, [field]: value } : person));
    setError("");
  };

  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    setError("");
    const normalized = people.map(person => ({ ...person, name: person.name.trim(),
      email: person.email.trim().toLowerCase(), residence: person.residence.trim() }));
    if (!waitlistMode && (normalized[0].email === normalized[1].email || normalized[0].phone_number === normalized[1].phone_number)) {
      setError("Each participant needs a different email address and phone number.");
      return;
    }
    if (normalized.slice(0, waitlistMode ? 1 : 2).some(person => (person.residence.toLowerCase() === "india") !== domestic)) {
      setError("Both participants must be in the selected pricing region. Select Individual for a mixed-region purchase.");
      return;
    }
    setBusy(true);
    try {
      if (waitlistMode) {
        await coupleRequest("couple-waitlist/", { ...normalized[0], coach_id: coach.id, plan_id: plan.id });
        trackCoachEvent("join_waitlist", coach, { form_id: "couple_waitlist", plan_type: "couple", plan_id: String(plan.id), duration_weeks: Number(plan.duration_weeks), pricing_region: domestic ? "DOMESTIC" : "INTERNATIONAL" });
        setComplete(true);
        return;
      }
      const data = await coupleRequest("couple-checkout/", { checkout_key: checkoutKey.current,
        coach_id: coach.id, plan_id: plan.id, participants: normalized, consent });
      sessionStorage.setItem(`couple:${data.enrollment_id}`, data.token);
      setReference(data.enrollment_id);
      const checkout = data.checkout;
      if (!checkout) throw new Error("Your order is being prepared. Please contact support with your reference if checkout does not open.");
      await loadPaymentSdk(checkout.gateway);
      trackCoachEvent("begin_checkout", coach, { form_id: "couple_enrollment", plan_type: "couple", plan_id: String(plan.id), duration_weeks: Number(plan.duration_weeks), value: Number(plan.price), currency: plan.currency, pricing_region: domestic ? "DOMESTIC" : "INTERNATIONAL" });
      const statusPath = `/payment/couple?enrollment_id=${encodeURIComponent(data.enrollment_id)}`;
      if (checkout.gateway === "cashfree") {
        await window.Cashfree({ mode: checkout.mode }).checkout({ paymentSessionId: checkout.payment_session_id, redirectTarget: "_self" });
      } else {
        // Native dialogs live above every document overlay. Close it before
        // the provider opens its own accessible modal, and restore on dismissal.
        dialog.current.close();
        const payment = new window.Razorpay({
          key: checkout.key, order_id: checkout.order_id, amount: checkout.amount, currency: checkout.currency,
          name: "Tru Fit", description: `${plan.duration_weeks}-week couple coaching`,
          prefill: { name: normalized[0].name, email: normalized[0].email, contact: normalized[0].phone_number },
          handler: () => navigate(statusPath),
          modal: { ondismiss: () => { dialog.current?.showModal(); setBusy(false); setError("Checkout was closed. You can reopen this same order while the reservation is valid."); } },
        });
        payment.on("payment.failed", () => { setBusy(false); setError("The payment attempt was unsuccessful. Please retry the same order or contact support if debited."); });
        payment.open();
      }
    } catch (failure) {
      trackCoachEvent("form_error", coach, { form_id: waitlistMode ? "couple_waitlist" : "couple_enrollment", error_type: "submission" });
      if (dialog.current && !dialog.current.open) dialog.current.showModal();
      if (failure.data?.enrollment_id && failure.data?.token) {
        sessionStorage.setItem(`couple:${failure.data.enrollment_id}`, failure.data.token);
        setReference(failure.data.enrollment_id);
      }
      if (String(failure.data?.code) === "couple_at_capacity" && !reference) {
        setWaitlistMode(true);
        setError("Two slots are no longer available. You can join the couple waitlist below.");
      } else setError(failure.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialog} className="couple-dialog" aria-labelledby={`${formId}-title`} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
      <div className="couple-dialog-heading">
        <div><p className="couple-eyebrow">{coach.name} · {plan.duration_weeks} weeks</p>
          <h2 id={`${formId}-title`}>{waitlistMode ? "Join the couple waitlist" : "Your journey, together"}</h2></div>
        <button type="button" className="couple-close" onClick={onClose} disabled={busy} aria-label="Close couple checkout">×</button>
      </div>
      {complete ? <div role="status"><p>You’re on the couple waitlist. We’ll contact you when two slots are available.</p><button type="button" className="couple-primary" onClick={onClose}>Done</button></div> : (
        <form data-clarity-mask="true" data-form-id={waitlistMode ? "couple_waitlist" : "couple_enrollment"} onSubmit={submit}>
          <p className="couple-intro">{waitlistMode ? "Leave the payer’s contact details. A couple plan needs two coaching slots." : "One payment. Two individual coaching plans. The same coach and start date."}</p>
          {!waitlistMode && <p className="couple-summary">{new Intl.NumberFormat("en-IN", { style: "currency", currency: plan.currency, maximumFractionDigits: 2 }).format(Number(plan.price))} total for both participants</p>}
          {error && <p className="couple-error" ref={errorRef} role="alert" tabIndex={-1}>{error}</p>}
          <div className="couple-people">
            {people.slice(0, waitlistMode ? 1 : 2).map((person, index) => (
              <fieldset key={index} disabled={busy || !!reference}>
                <legend>{index === 0 ? "You — payer" : "Your partner"}</legend>
                <label htmlFor={`${formId}-${index}-name`}>Full name</label>
                <input id={`${formId}-${index}-name`} value={person.name} maxLength={300} required autoComplete={`section-person${index} name`} onChange={event => update(index, "name", event.target.value)} />
                <label htmlFor={`${formId}-${index}-email`}>Email address</label>
                <input id={`${formId}-${index}-email`} type="email" value={person.email} maxLength={300} required autoComplete={`section-person${index} email`} onChange={event => update(index, "email", event.target.value)} />
                <label htmlFor={`${formId}-${index}-phone`}>Phone number with country code</label>
                <input id={`${formId}-${index}-phone`} type="tel" value={person.phone_number} pattern="\+[0-9]{7,15}" maxLength={16} required placeholder="+919876543210" autoComplete={`section-person${index} tel`} aria-describedby={`${formId}-${index}-hint`} onChange={event => update(index, "phone_number", event.target.value.replace(/[^+0-9]/g, ""))} />
                <small id={`${formId}-${index}-hint`}>Include + and the country code; no spaces.</small>
                <label htmlFor={`${formId}-${index}-country`}>Country of residence</label>
                <input id={`${formId}-${index}-country`} value={person.residence} readOnly={domestic} maxLength={100} required autoComplete={`section-person${index} country-name`} placeholder="e.g. United States" onChange={event => update(index, "residence", event.target.value)} />
              </fieldset>
            ))}
          </div>
          {!waitlistMode && <label className="couple-consent"><input type="checkbox" checked={consent} required disabled={busy || !!reference} onChange={event => setConsent(event.target.checked)} /><span>I confirm both participants consent to enrollment and accept the <a href="/terms-conditions" target="_blank" rel="noreferrer">program terms</a> and <a href="/refund-policy" target="_blank" rel="noreferrer">refund policy</a>.</span></label>}
          {reference && <p className="couple-reference">Order reference: {reference}. <a href={`/payment/couple?enrollment_id=${reference}`}>Check payment status</a></p>}
          <button type="submit" className="couple-primary" disabled={busy}>{busy ? "Preparing checkout…" : waitlistMode ? "Join waitlist" : reference ? "Reopen payment" : "Continue to secure payment"}</button>
          {!waitlistMode && <small className="couple-footnote">Two slots are reserved for 30 minutes. Your program begins seven days after payment confirmation. Each participant receives their own onboarding email.</small>}
        </form>
      )}
    </dialog>
  );
}
