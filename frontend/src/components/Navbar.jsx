import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import financialLogo from '../assets/logo.png';
const Navbar = ({ onSignOut }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    
    getUser();
  }, []);

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return '?';
    
    // Try to get name from user metadata if available
    if (user.user_metadata && user.user_metadata.full_name) {
      const nameParts = user.user_metadata.full_name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    
    // Fallback to email
    return user.email[0].toUpperCase();
  };

  // Get user display name
  const getUserName = () => {
    if (!user) return 'User';
    
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white flex items-center justify-center font-bold text-xl">
                <img src={financialLogo} alt="Financial App Logo" className="h-10 sm:h-12 md:h-14" />
                <span className="ml-2">FinTrack</span>
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/')
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className={`${
                  isActive('/transactions')
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
              >
                Transactions
              </Link>
              <Link
                to="/reports"
                className={`${
                  isActive('/reports')
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
              >
                Reports
              </Link>
              <Link
                to="/settings"
                className={`${
                  isActive('/settings')
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
              >
                Settings
              </Link>
            </div>
          </div>
          
          {/* User menu */}
          <div className="hidden md:flex md:items-center">
            {/* User welcome section */}
            <div className="flex items-center bg-blue-800 bg-opacity-50 rounded-full px-3 py-1 md:px-4">
              <div className="flex items-center mr-2 md:mr-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold text-sm">
                  {getUserInitials()}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className="text-white text-xs sm:text-sm">Welcome,</p>
                  <p className="text-white font-semibold -mt-1 text-xs sm:text-sm">{getUserName()}</p>
                </div>
              </div>
              
              <button
                onClick={onSignOut}
                className="bg-blue-800 hover:bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {/* Mobile user avatar */}
            <div className="mr-2 h-8 w-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold text-sm">
              {getUserInitials()}
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu - hamburger or X */}
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Mobile welcome message */}
          <div className="px-4 py-3 bg-blue-800">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold text-sm">
                {getUserInitials()}
              </div>
              <div>
                <p className="text-white text-sm">Welcome,</p>
                <p className="text-white font-semibold -mt-1">{getUserName()}</p>
              </div>
            </div>
          </div>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                isActive('/')
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`${
                isActive('/transactions')
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              to="/reports"
              className={`${
                isActive('/reports')
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              to="/settings"
              className={`${
                isActive('/settings')
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={onSignOut}
              className="w-full text-left bg-blue-800 text-white pl-3 pr-4 py-2 text-base font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 