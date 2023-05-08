// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Link as ScrollLink, scroller } from 'react-scroll';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const handleClick = (section: string) => {
    if (router.pathname === '/') {
      scroller.scrollTo(section, {
        duration: 500,
        smooth: true,
        offset: -70,
      });
    } else {
      router.push(`/#${section}`);
    }
  };

  const handleLogoClick = () => {
    if (router.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarAnimation = {
    initial: { backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '5rem' },
    scrolled: { backgroundColor: 'rgba(0, 0, 0, 0.8)', height: '4rem' },
  };


  return (
    <m.header
      className={`fixed w-full z-50 top-0 transition-all duration-500 ease-in-out ${
        scrolled ? 'shadow-md' : ''
      }`}
      variants={navbarAnimation}
      initial="initial"
      animate={scrolled ? 'scrolled' : 'initial'}
    >
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        <p>
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-12 cursor-pointer"
            onClick={handleLogoClick}
          />
        </p>
        <nav className="text-white">
          <ul className="flex space-x-4">
            {['features', 'pricing'].map((section) => (
              <li key={section}>
                <p
                  onClick={() => handleClick(section)}
                  className="cursor-pointer hover:text-purple-500 transition-colors"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </p>
              </li>
            ))}
            <li>
              {session ? (
                <NextLink href="/askgit" passHref>
                  <p className="cursor-pointer hover:text-purple-500 transition-colors">
                    AskGit
                  </p>
                </NextLink>
              ) : (
                <p
                  className="text-gray-400 cursor-default"
                  title="Please Sign in"
                >
                  AskGit
                </p>
              )}
            </li>
          </ul>
        </nav>
        {session ? (
          <button
            className="text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
            onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="text-white bg-green-500 rounded-md px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
            onClick={() => signIn('your-authentication-provider', { callbackUrl: `${window.location.origin}/askgit` })}
          >
            Sign In
          </button>
        )}
      </div>
    </m.header>
  );
  
};

export default Navbar;