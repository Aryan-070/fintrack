import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import financialLogo from '../assets/logo.png'; // Create or import a logo
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleAuthCallback = useCallback(async () => {
    try {
      console.log('Attempting to get session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error('Failed to get session');
      if (!session) throw new Error('No active session found');

      console.log('Session obtained:', session);
      const userId = session.user.id;
      console.log('User ID:', userId);

      // Call the API with the user ID
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/users/${userId}`);
        console.log('User data:', response.data);
      } catch (apiError) {
        console.error('API call error:', apiError.message);
      }

      // Get the intended destination from state, or default to dashboard
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      console.error('Auth error:', error.message);
      // Optionally show error to user
    }
  }, [navigate, location]);

  useEffect(() => {
    if (location.hash && location.hash.includes('access_token')) {
      handleAuthCallback();
      return;
    }

    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location, handleAuthCallback]);

  // Memoize the Auth component appearance
  const authAppearance = {
    theme: ThemeSupa,
    variables: {
      default: {
        colors: {
          brand: '#4F46E5',
          brandAccent: '#4338CA',
        },
        borderRadii: {
          button: '0.5rem',
          input: '0.5rem',
        },
      },
    },
    className: {
      button: 'w-full py-3 px-4 rounded-md',
      input: 'rounded-md',
      label: 'text-sm font-medium text-gray-700 mb-1',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={financialLogo} alt="Financial App Logo" className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">FinTrack</h1>
            <p className="text-gray-600 mt-2">Your personal finance tracker</p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={authAppearance}
            providers={['google', 'github']}
            socialLayout="horizontal"
            onlyThirdPartyProviders={true}
          />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 