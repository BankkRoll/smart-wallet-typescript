import { m } from 'framer-motion';

const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' },
};

const PricingSection = () => {
  const plans = [
    {
      title: 'Free Trial',
      price: 'Free',
      limit: '1 Test Repo',
      buttonText: 'Get Started',
    },
    {
      title: 'Pro',
      price: '$12.99/mo',
      limit: 'Unlimited Repos',
      buttonText: 'Upgrade Now',
    },
  ];

  return (
    <m.section
      id="pricing"
      className="py-16 px-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Pricing</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <m.div
            key={index}
            className="flex flex-col items-center p-8 border-2 border-white rounded-lg shadow-md hover:border-purple-200 transition-all duration-300"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
            <p className="text-4xl font-bold mb-4">{plan.price}</p>
            <p className="text-xl mb-8">{plan.limit}</p>
            <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100 transition duration-200">
              {plan.buttonText}
            </button>
          </m.div>
        ))}
      </div>
    </m.section>
  );
};

export default PricingSection;


