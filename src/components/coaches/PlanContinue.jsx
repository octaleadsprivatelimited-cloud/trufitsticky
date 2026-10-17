export default function PlanContinue({ plan, price, onContinue, disabled = false, label = 'Continue to details', couple = false }) {
  return <div className="coaching-plan-action"><div className="coaching-action-row"><div><span>{plan}</span><strong>{price}<small> {couple ? 'total for two' : 'total'}</small></strong></div><button type="button" onClick={onContinue} disabled={disabled}>{label}</button></div><p>One payment. No automatic renewal. Details next, then payment.</p></div>;
}
