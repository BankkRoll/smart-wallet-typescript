import { m, motion, Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';

const WhyChooseUsSection = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Function to handle the click event of the "Get Started" button
  const handleGetStartedClick = () => {
    if (session) {
      router.push('/askgit');
    } else {
      signIn('your-authentication-provider', { callbackUrl: `${window.location.origin}/askgit` });
    }
  };

  // Variants for staggered animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <m.section
      id="home"
      className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-16 px-4 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="text-center md:text-left md:col-span-1">
        <motion.section
          className="flex flex-col items-center justify-center min-h-[500px] text-white px-4"
          variants={containerVariants}
        >
          <div className="max-w-2xl text-center">
            <motion.h1
              className="text-6xl font-bold mb-4"
              variants={itemVariants}
              whileInView={{ scale: 1.05 }}
            >
              Welcome to
            </motion.h1>
            <motion.h1
              className="text-6xl font-bold mb-4 text-purple-700"
              variants={itemVariants}
              whileInView={{ scale: 1.05 }}
            >
              AskGit
            </motion.h1>
            <motion.p
              className="text-2xl mb-8"
              variants={itemVariants}
              whileInView={{ scale: 1.05 }}
            >
              Code Smarter, Not Harder: Enhance Your GitHub Experience with AskGit,
              the AI-Coding Assistant!
            </motion.p>
            <motion.button
              onClick={handleGetStartedClick}
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.section>
      </div>
      <div className="md:col-span-2" style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)', position: 'relative', paddingBottom: '60%', height: 0, overflow: 'hidden' }}>
        <motion.img
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
          src="/example.jpg"
          title="Promotional"
          variants={itemVariants}
        ></motion.img>
      </div>
    </m.section>
  );
};

export default WhyChooseUsSection;


