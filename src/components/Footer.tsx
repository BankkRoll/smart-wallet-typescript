import { m } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <m.footer
      className="w-full min-h-[5rem] text-white text-center bg-black py-4"
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-sm">
          © {currentYear} AskGit. All rights reserved.
        </p>
      </div>
    </m.footer>
  );
};

export default Footer;