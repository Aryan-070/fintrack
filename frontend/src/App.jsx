import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { AssetProvider } from './context/AssetContext';
import { LiabilityProvider } from './context/LiabilityContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Wrap providers to avoid repetition
const AppProviders = ({ children }) => (
  <TransactionProvider>
    <AssetProvider>
      <LiabilityProvider>
        <Layout>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Layout>
      </LiabilityProvider>
    </AssetProvider>
  </TransactionProvider>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Routes without authentication requirement */}
            <Route
              path="/dashboard"
              element={
                <AppProviders>
                  <Dashboard />
                </AppProviders>
              }
            />
            <Route
              path="/transactions"
              element={
                <AppProviders>
                  <TransactionsPage />
                </AppProviders>
              }
            />
            <Route
              path="/reports"
              element={
                <AppProviders>
                  <ReportsPage />
                </AppProviders>
              }
            />
            <Route
              path="/settings"
              element={
                <AppProviders>
                  <SettingsPage />
                </AppProviders>
              }
            />
            
            {/* Catch all route for 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;