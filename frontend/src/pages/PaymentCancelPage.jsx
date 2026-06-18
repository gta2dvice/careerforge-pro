import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 px-8 pt-10 pb-12 relative overflow-hidden">
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-neutral-700/20 blur-lg" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center ring-4 ring-white/10"
          >
            <XCircle className="w-9 h-9 text-neutral-300" strokeWidth={2} />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-1">
            Payment Cancelled
          </h1>
          <p className="text-neutral-400 text-sm">
            No charges have been made
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          <p className="text-neutral-600 leading-relaxed">
            Your checkout was cancelled and you haven't been charged.
            You can continue using CareerForge Pro with your current plan,
            or try upgrading again anytime.
          </p>

          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              What you can still do
            </p>
            <ul className="space-y-1.5 text-sm text-neutral-600">
              <li>• Build and edit resumes with the free plan</li>
              <li>• Use 5 AI credits per month</li>
              <li>• Export resumes as PDF</li>
              <li>• Analyze job descriptions</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
            <Link
              to="/app"
              className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-semibold transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
