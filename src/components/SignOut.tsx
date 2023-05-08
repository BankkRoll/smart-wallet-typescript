// components/SignOut.tsx
import { signOut } from 'next-auth/react';

const SignOut = () => {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100 transition duration-200"
    >
      Sign Out
    </button>
  );
};

export default SignOut;