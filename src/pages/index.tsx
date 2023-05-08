// pages/index.tsx
import { useEffect, useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import WhyChooseUsSection from '../components/WhyChooseUs';
import FeaturesSection from '../components/Features';
import PricingSection from '../components/Pricing';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Router from 'next/router';
import 'nprogress/nprogress.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    window.addEventListener('beforeunload', handleStart);
    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleError);

    return () => {
      clearTimeout(delay);
      window.removeEventListener('beforeunload', handleStart);
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleError);
    };
  }, []);

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h2
          className="text-white text-4xl mb-4"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          Loading
        </motion.h2>
        <motion.div
          className="flex space-x-2"
          animate={{ x: [-20, 0, 20, 0, -20] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>
    );
  }


  return (
    <LazyMotion features={domAnimation}>
      <Navbar />
      <m.main
        className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-24 lg:px-36 px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Other sections for unauthenticated users */}
        <WhyChooseUsSection />
        <FeaturesSection />
        <PricingSection />
      </m.main>
      <Footer />
    </LazyMotion>
  );
}
