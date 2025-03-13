import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onSignOut={handleSignOut} />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} FinTrack. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout; 