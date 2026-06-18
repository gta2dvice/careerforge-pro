import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import LandingPage from './pages/LandingPage';
import ResumeBuilder from './pages/ResumeBuilder';
import PricingPage from './pages/PricingPage';
import PrintableResume from './components/PrintableResume';
import UpgradeModal from './components/ui/UpgradeModal';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/app"
          element={
            <ResumeProvider>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <ResumeBuilder />
              </motion.div>
            </ResumeProvider>
          }
        />
        <Route
          path="/pricing"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <PricingPage />
            </motion.div>
          }
        />
        <Route
          path="/dashboard/view-resume/:resume_id"
          element={
            <ResumeProvider>
              <PrintableResume />
            </ResumeProvider>
          }
        />
        <Route
          path="/payment-success"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <PaymentSuccessPage />
            </motion.div>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <PaymentCancelPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SubscriptionProvider>
        <AnimatedRoutes />
        <UpgradeModal />
      </SubscriptionProvider>
    </BrowserRouter>
  );
}

export default App;
