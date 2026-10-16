import { Link, useLocation, useSearchParams } from 'react-router-dom';
import BookingWelcome from '../components/BookingWelcome';
import { readDemoBooking } from '../portal/booking.mjs';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const booking = params.get('demo') === '1' ? location.state?.booking || readDemoBooking() : null;
  if (booking?.isPreview === true) return <BookingWelcome booking={booking}/>;
  return (
    <section className="page-intro wrap">
      <p className="eyebrow">Your booking</p>
      <h1>Let’s confirm your next step.</h1>
      <p>No confirmed booking details are available in this browser. Contact the Tru Fit team with your payment reference so we can confirm your coach and session time.</p>
      <p><a className="button" href="mailto:support@betrufit.com">Contact support</a></p>
      <p><a className="text-link" href="tel:+917207259556">Call +91 72072 59556</a></p>
      <Link className="text-link" to="/coaches">Browse coaches</Link>
    </section>
  );
}
