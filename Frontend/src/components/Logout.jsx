import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthProvider';

const Logout = () => {
  const { setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/users/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setAccessToken(null);

        // 🔥 HARD REFRESH + REDIRECT
        window.location.href = '/login';
      }
    };

    logoutUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500 bg-white">
      Logging out...
    </div>
  );
};

export default Logout;