// components/SignUp.tsx
import { signIn } from 'next-auth/react';

const SignUp = () => {
  const handleSignUp = () => {
    signIn();
  };

  return (
    <button
      onClick={handleSignUp}
      className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100 transition duration-200"
    >
      Sign Up
    </button>
  );
};

export default SignUp;