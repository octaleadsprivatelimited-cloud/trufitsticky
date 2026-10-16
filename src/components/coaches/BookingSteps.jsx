export default function BookingSteps({ current = 1 }) {
  return <ol className="booking-steps" aria-label="Booking progress">
    {['Choose a plan', 'Your details', 'Payment'].map((label, index) => <li key={label} className={index + 1 === current ? 'is-current' : index + 1 < current ? 'is-complete' : ''} aria-current={index + 1 === current ? 'step' : undefined}><span aria-hidden="true">{index + 1}</span><span>{label}</span></li>)}
  </ol>;
}
