import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../api/client';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [sessionData, setSessionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setStatus('success'); // No session to verify, show generic success
        return;
      }

      try {
        const response = await apiClient.get(`/api/payments/verify-session?session_id=${sessionId}`);
        if (response.data?.success) {
          setSessionData(response.data.data);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(response.data?.message || 'Verification failed');
        }
      } catch (err) {
        // Even if verification fails, the payment likely went through
        // Webhooks will handle the final update
        console.error('Session verification error:', err);
        setStatus('success');
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {status === 'verifying' && (
          <div className="text-center bg-white rounded-2xl border border-neutral-200 shadow-xl p-12">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-neutral-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Verifying Payment...
            </h1>
            <p className="text-neutral-500">
              Please wait while we confirm your subscription
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
            {/* Success header */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 pt-10 pb-12 relative overflow-hidden">
              <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
              <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-emerald-400/20 blur-lg" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30"
              >
                <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
              </motion.div>

              <h1 className="text-2xl font-bold text-white mb-1">
                Payment Successful!
              </h1>
              <p className="text-emerald-100 text-sm">
                Welcome to CareerForge Pro
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-6">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                    Pro Plan Activated
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {[
                    'Unlimited AI credits',
                    'Unlimited resumes',
                    'Cover letter generator',
                    'Premium templates',
                    'Advanced ATS optimization',
                    'Priority support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {sessionData?.customerEmail && (
                <p className="text-xs text-neutral-500">
                  Confirmation sent to <strong className="text-neutral-700">{sessionData.customerEmail}</strong>
                </p>
              )}

              <div className="space-y-3">
                <Link
                  to="/app"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="block text-center text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center bg-white rounded-2xl border border-neutral-200 shadow-xl p-12">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Verification Issue
            </h1>
            <p className="text-neutral-500 mb-6 leading-relaxed">
              {errorMessage || 'We couldn\'t verify your payment right now. If you were charged, your Pro access will be activated shortly.'}
            </p>
            <div className="space-y-3">
              <Link
                to="/app"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="block text-center text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
