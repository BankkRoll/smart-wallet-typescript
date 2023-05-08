// components/SignIn.tsx
import { signIn } from 'next-auth/react';

const SignIn = () => {
  const handleSignIn = () => {
    signIn();
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100 transition duration-200"
    >
      Sign In
    </button>
  );
};

export default SignIn;