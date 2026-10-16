import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Open-redirect guard: post-payment redirect targets (calendly_link / spurfit_url)
// can arrive via attacker-forgeable query params. Only honor same-origin internal
// paths or https:// URLs — never javascript:/data:/http:/protocol-relative. Returns
// a safe URL/path, or null (caller falls back to an internal route).
const safeRedirectUrl = (url) => {
  if (typeof url !== 'string' || !url) return null;
  try {
    const u = new URL(url, window.location.origin);
    if (u.origin === window.location.origin) return u.pathname + u.search + u.hash;
    if (u.protocol === 'https:') return u.href;
    return null;
  } catch {
    return null;
  }
};

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Verifying your payment...');
  const retryCountRef = useRef(0);
  const retryStatusRef = useRef(null);
  const MAX_RETRIES = 10;

  useEffect(() => {
    const controller = new AbortController();
    const timers = new Set();
    retryCountRef.current = 0;
    const schedule = (callback, delay) => {
      if (controller.signal.aborted) return;
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!controller.signal.aborted) callback();
      }, delay);
      timers.add(timer);
    };

    const verifyPayment = async (clientId, orderId, paymentId, signature) => {
      setStatus('verifying');
      setMessage('Verifying your payment...');

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/int-payment-verify/`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: clientId,
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
            }),
          }
        );

        const result = await response.json();
        if (controller.signal.aborted) return;

        if (result.flag === 'True') {
          setStatus('success');
          setMessage('Payment successful! Redirecting...');

          // Get redirect info from localStorage as fallback
          const contextData = localStorage.getItem(`payment_context_${clientId}`);
          let context = {};
          if (contextData) {
            try {
              context = JSON.parse(contextData);
            } catch (e) {
              console.error("Error parsing context:", e);
            }
          }

          // Priority: Backend API response > localStorage
          const finalCalendlyLink = result.calendly_link || context.calendlyLink;
          const finalSpurfitUrl = result.spurfit_url || context.spurfitUrl;

          // Clean up
          localStorage.removeItem(`payment_context_${clientId}`);
          localStorage.removeItem(`payment_success_${clientId}`);

          schedule(() => {
            if (result.is_consultation || context.calendlyLink) {
              window.location.href = safeRedirectUrl(finalCalendlyLink) || '/payment/success?status=paid';
            } else if (safeRedirectUrl(finalSpurfitUrl)) {
              window.location.href = safeRedirectUrl(finalSpurfitUrl);
            } else {
              navigate('/');
            }
          }, 2000);
        } else {
          handleVerificationFailure(result, clientId);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus('error');
        setMessage('Error verifying payment. Please contact support.');
        if (import.meta.env.DEV) {
          console.error('Payment verification error:', error);
        }
        schedule(() => {
          localStorage.removeItem(`payment_context_${clientId}`);
          navigate('/');
        }, 3000);
      }
    };

    const checkPaymentStatus = async (clientId, orderId) => {
      setStatus('checking');
      setMessage('Checking payment status...');

      try {
        // ✅ Use correct backend endpoint: POST to order-status-check/{client_id}/
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/order-status-check/${clientId}/`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderId
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }

        const result = await response.json();
        if (controller.signal.aborted) return;

        // ✅ Normalize status across Cashfree (PAID/ACTIVE/EXPIRED) and Razorpay (paid/created)
        const isPaid =
          result.paid === true ||
          result.status === 'paid' ||
          result.status === 'PAID' ||
          result.order_status === 'PAID' ||
          result.payment_status === 'SUCCESS';

        const isExpired =
          result.expired === true ||
          result.status === 'expired' ||
          result.status === 'EXPIRED' ||
          result.order_status === 'EXPIRED';

        const isTerminated =
          result.order_status === 'TERMINATED' ||
          result.order_status === 'TERMINATION_REQUESTED';

        const isInvalid = result.valid === false;

        if (isPaid) {
          setStatus('success');
          setMessage('Payment successful! Redirecting...');

          const contextData = localStorage.getItem(`payment_context_${clientId}`);
          let context = {};
          if (contextData) {
            try {
              context = JSON.parse(contextData);
            } catch (e) {
              if (import.meta.env.DEV) {
                console.error("Error parsing context:", e);
              }
            }
          }

          // Priority: Backend API response > localStorage
          const finalCalendlyLink = result.calendly_link || context.calendlyLink;
          const finalSpurfitUrl = result.spurfit_url || context.spurfitUrl;

          localStorage.removeItem(`payment_context_${clientId}`);

          schedule(() => {
            if (result.is_consultation || context.calendlyLink) {
              window.location.href = safeRedirectUrl(finalCalendlyLink) || '/payment/success?status=paid';
            } else if (safeRedirectUrl(finalSpurfitUrl)) {
              window.location.href = safeRedirectUrl(finalSpurfitUrl);
            } else {
              navigate('/');
            }
          }, 2000);
        } else if (isExpired || isTerminated) {
          setStatus('failed');
          setMessage('Payment session expired. Please try again.');
          schedule(() => {
            localStorage.removeItem(`payment_context_${clientId}`);
            navigate('/');
          }, 3000);
        } else if (isInvalid) {
          setStatus('failed');
          setMessage(result.error || 'Payment order is invalid or expired.');
          schedule(() => {
            localStorage.removeItem(`payment_context_${clientId}`);
            navigate('/');
          }, 3000);
        } else {
          // Order is still ACTIVE/created/attempted - retry with limit
          retryCountRef.current += 1;
          if (retryCountRef.current >= MAX_RETRIES) {
            setStatus('timeout');
            setMessage(`Unable to confirm payment after ${MAX_RETRIES} attempts. If you were charged, please contact support.`);
          } else {
            setMessage(`Checking payment status... (Attempt ${retryCountRef.current + 1}/${MAX_RETRIES})`);
            schedule(() => checkPaymentStatus(clientId, orderId), 3000);
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus('error');
        setMessage('Unable to verify payment status. Please contact support.');
        if (import.meta.env.DEV) {
          console.error('Error checking payment status:', error);
        }
        schedule(() => {
          localStorage.removeItem(`payment_context_${clientId}`);
          navigate('/');
        }, 3000);
      }
    };

    const handleRedirectFailure = (errorCode, errorDescription, clientId) => {
      setStatus('failed');
      setMessage(`Payment failed: ${errorDescription || errorCode}`);

      const is3DSError = (
        errorCode === "101" ||
        errorCode === "BAD_REQUEST_ERROR" ||
        errorDescription?.toLowerCase().includes("3ds") ||
        errorDescription?.toLowerCase().includes("authentication")
      );

      if (is3DSError) {
        alert(
          "🔒 Card Authentication Failed\n\n" +
          "The 3D Secure authentication failed. Your card was NOT charged.\n\n" +
          "Please try again with the same card or use a different payment method."
        );
      } else {
        alert(`❌ Payment Failed\n\n${errorDescription || errorCode}\n\nYour card was NOT charged.`);
      }

      if (clientId) {
        localStorage.removeItem(`payment_context_${clientId}`);
        localStorage.removeItem(`payment_success_${clientId}`);
      }

      schedule(() => navigate('/'), 3000);
    };

    const handleVerificationFailure = (result, clientId) => {
      setStatus('failed');

      const is3DSError = result.error_type === "3DS_ERROR" ||
                        result.error_code === "3DS_AUTH_FAILED" ||
                        result.error_code === "SESSION_EXPIRED" ||
                        result.error_code === "TRANSACTION_NOT_FOUND";

      if (is3DSError) {
        setMessage(`Authentication Issue: ${result.user_message || result.error}. Your card was NOT charged.`);
      } else {
        setMessage(result.user_message || result.error || "Payment verification failed");
      }

      if (clientId) {
        localStorage.removeItem(`payment_context_${clientId}`);
        localStorage.removeItem(`payment_success_${clientId}`);
      }

      schedule(() => navigate('/'), 3000);
    };

    const processReturn = () => {
      const clientId = searchParams.get('client_id');
      const redirectStatus = searchParams.get('status');
      const errorMessage = searchParams.get('error_message');
      const calendlyLink = searchParams.get('calendly_link');
      const spurfitUrl = searchParams.get('spurfit_url');
      const isConsultation = searchParams.get('is_consultation') === 'true';

      // ✅ NEW FLOW: Handled by Backend Redirect
      if (redirectStatus === 'success') {
        setStatus('success');
        setMessage('Payment successful! Redirecting...');

        // Clean up localStorage
        localStorage.removeItem(`payment_context_${clientId}`);
        localStorage.removeItem(`payment_success_${clientId}`);

        schedule(() => {
          if (isConsultation || calendlyLink) {
            window.location.href = safeRedirectUrl(calendlyLink) || '/payment/success?status=paid';
          } else if (safeRedirectUrl(spurfitUrl)) {
            window.location.href = safeRedirectUrl(spurfitUrl);
          } else {
            navigate('/');
          }
        }, 2000);
        return;
      }

      if (redirectStatus === 'failed' || redirectStatus === 'error') {
        setStatus('error');
        setMessage(errorMessage || 'Payment failed. Please try again.');
        schedule(() => navigate('/'), 4000);
        return;
      }

      // Support both Cashfree (order_id) and Razorpay (razorpay_order_id) param names
      const orderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id');
      const paymentId = searchParams.get('razorpay_payment_id');
      const signature = searchParams.get('razorpay_signature');
      // Support both standard (error_code) and Razorpay bracket notation (error[code])
      const errorCode = searchParams.get('error_code') || searchParams.get('error[code]');
      const errorDescription = searchParams.get('error_description') || searchParams.get('error[description]');

      // ✅ REDIRECT MODE FAILURE - Error in URL params (Fallback for older links or Cashfree)
      if (errorCode) {
        handleRedirectFailure(errorCode, errorDescription, clientId);
        return;
      }

      // ✅ REDIRECT MODE SUCCESS - Payment details in URL (Cashfree)
      if (paymentId && signature && orderId && clientId) {
        verifyPayment(clientId, orderId, paymentId, signature);
        return;
      }

      // ✅ FALLBACK - Check localStorage for success data
      if (clientId) {
        const successData = localStorage.getItem(`payment_success_${clientId}`);
        if (successData) {
          try {
            const data = JSON.parse(successData);
            verifyPayment(clientId, orderId || data.order_id, data.payment_id, data.signature);
            return;
          } catch (e) {
            if (import.meta.env.DEV) {
              console.error("Error parsing success data:", e);
            }
          }
        }
      }

      // ✅ LAST RESORT - Check payment status
      if (clientId && orderId) {
        checkPaymentStatus(clientId, orderId);
      } else {
        setStatus('error');
        setMessage('Unable to process payment. Please contact support.');
        schedule(() => navigate('/'), 3000);
      }
    };
    retryStatusRef.current = checkPaymentStatus;
    processReturn();
    return () => {
      controller.abort();
      timers.forEach(clearTimeout);
      retryStatusRef.current = null;
    };
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(46,16,101,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        {status === 'checking' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⌕</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif' }}>Checking Payment Status...</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif' }}>{message}</p>
          </>
        )}
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>◷</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif' }}>Verifying Payment...</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif' }}>{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif', color: '#6d28d9' }}>Payment Successful!</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif' }}>{message}</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>×</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif', color: '#6d28d9' }}>Payment Failed</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif' }}>{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>!</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif', color: '#6d28d9' }}>Error</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif' }}>{message}</p>
          </>
        )}
        {status === 'timeout' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>◷</div>
            <h2 style={{ marginBottom: '10px', fontFamily: 'Montserrat, sans-serif', color: '#6d28d9' }}>Verification Timeout</h2>
            <p style={{ color: '#705b8c', fontFamily: 'Montserrat, sans-serif', marginBottom: '20px' }}>{message}</p>
            <button
              onClick={() => {
                retryCountRef.current = 0;
                const clientId = searchParams.get('client_id');
                const orderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id');
                if (clientId && orderId) {
                  retryStatusRef.current?.(clientId, orderId);
                }
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6d28d9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                marginRight: '10px'
              }}
            >
              Try Again
</button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ffffff',
                color: '#2e1065',
                border: '1px solid #e5d8fa',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Go Home
</button>
          </>
        )}
        {(status === 'failed' || status === 'error') && (
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#6d28d9',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Go Home
</button>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;

