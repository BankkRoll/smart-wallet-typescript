import { m } from 'framer-motion';

const sectionVariants = {
  initial: { opacity: 0 },
  inView: { opacity: 1 },
};

const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' },
  inView: { scale: 1.1, y: -10 },
};

const features = [
  {
    title: 'Natural Language Queries',
    description:
      'AskGit uses advanced language processing to allow you to query your GitHub repos using simple, natural language.',
  },
  {
    title: 'Intelligent Insights',
    description:
      'Gain valuable insights into your codebase with AskGit. Improve code quality, detect trends, and optimize your development workflow.',
  },
  {
    title: 'Seamless Integration',
    description:
      'AskGit integrates smoothly with your GitHub account, allowing you to access and analyze your repos without any hassle.',
  },
];

const FeaturesSection = () => {
  return (
    <m.section
      id="features"
      className="py-16 px-4 text-white"
      variants={sectionVariants}
      initial="initial"
      animate="inView"
      whileInView="inView"
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <p className="text-lg w-96 m-auto mb-12">
          Anyone can sign up and ask any GitHub repo a question. Learn about code, development, documentation,
          and anything else you can imagine. Instant GitHub knowledge at your fingertips.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <m.div
            key={index}
            className="flex flex-col items-center p-8 border-2 border-white rounded-lg shadow-md max-w-xs mx-auto hover:border-purple-200 transition-all duration-300 text-center"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileInView="inView"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p>{feature.description}</p>
          </m.div>
        ))}
      </div>
    </m.section>
  );
};

export default FeaturesSection;