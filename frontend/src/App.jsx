import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import LandingPage from './pages/LandingPage';
import ResumeBuilder from './pages/ResumeBuilder';
import PricingPage from './pages/PricingPage';
import PrintableResume from './components/PrintableResume';

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
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
