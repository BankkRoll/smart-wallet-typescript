import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import Navbar from '@/components/NavBar';
import GitHubRepoImporter from '@/components/AskGitPanel';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function AskGit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hover, setHover] = useState(false);

  const handleHover = () => {
    setHover(true);
  }

  const handleLeave = () => {
    setHover(false);
  }

  const handleGetStartedClick = () => {
    if (session) {
      // Redirect to AskGit page
      router.push('/askgit');
    } else {
      // Show authentication provider login form
      signIn('your-authentication-provider', { callbackUrl: `${window.location.origin}/askgit` });
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      },
    },
  }

  const buttonVariants = {
    rest: {
      backgroundColor: "#ffffff",
      color: "#000000"
    },
    hover: {
      backgroundColor: "#000000",
      color: "#ffffff",
      transition: {
        duration: 0.2
      }
    },
  }

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
      {!session && (
        <m.div
          className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-white text-4xl mb-4">Please log in to access this page.</div>
          <motion.button
            className="bg-white text-black font-bold py-2 px-4 rounded-full"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="hover"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={handleGetStartedClick} // handle button click
          >
            {session ? "Go to AskGit" : (hover ? "Log in" : "Get started")}
          </motion.button>
        </m.div>
      )}
      {session && (
        <m.main
          className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-24 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Other sections for authenticated users */}
          <GitHubRepoImporter />
        </m.main>
      )}
      <Footer />
    </LazyMotion>
  );
}

