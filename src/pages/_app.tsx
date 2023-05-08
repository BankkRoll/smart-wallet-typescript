// pages/_app.tsx
import { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import Head from 'next/head';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { motion } from 'framer-motion';
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

// Add event listeners to handle route changes
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true));
    Router.events.on('routeChangeComplete', () => setIsLoading(false));
    Router.events.on('routeChangeError', () => setIsLoading(false));

    setIsLoading(false);

    return () => {
      Router.events.off('routeChangeStart', () => setIsLoading(true));
      Router.events.off('routeChangeComplete', () => setIsLoading(false));
      Router.events.off('routeChangeError', () => setIsLoading(false));
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
    <SessionProvider session={session}>
      <Head>
        {/* Meta tags for SEO */}
        <title>AskGit</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta name="keywords" content="GitHub, AI, ChatBot" />
        <meta name="author" content="BankkRoll" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.askgit.live" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="title" content="AskGit" />

        <meta property="og:title" content="AskGit" />
        <meta property="og:description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta property="og:url" content="https://www.askgit.live" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AskGit" />
        <meta property="og:image" content="https://www.askgit.live/example.jpg" />
        <meta name="twitter:image" content="https://www.askgit.live/example.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AskGit" />
        <meta name="twitter:description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta name="twitter:site" content="@bankkroll_eth" />
        <meta property="twitter:url" content="https://www.askgit.live/" />
      </Head>

      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
}