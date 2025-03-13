import axios from 'axios';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

// Create axios instance with base URL from .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Financial data services
export const financialService = {
  // Get dashboard data
  getDashboardData: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/users/${userId}`);
      console.log('User data:', response.data);

      // Store tokens securely
      localStorage.setItem('jwt_token', response.data.jwt_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    } catch (apiError) {
      console.error('API call error:', apiError.message);
    }

    return api.get(`/api/dashboard/${userId}`);
  },
  
  // Transactions
  getTransactions: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.get(`/api/transactions/user/${userId}`);
  },
  addTransaction: async (transaction) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    try {
      const response = await api.post(`/api/transactions`, { ...transaction, user_id: userId });
      toast.success('Transaction added successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to add transaction.');
      throw error;
    }
  },
  updateTransaction: async (id, transaction) => {
    try {
      const response = await api.put(`/api/transactions/${id}`, transaction);
      toast.success('Transaction updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update transaction.');
      throw error;
    }
  },
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/api/transactions/${id}`);
      toast.success('Transaction deleted successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to delete transaction.');
      throw error;
    }
  },
  
  // Assets
  getAssets: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.get(`/api/assets/user/${userId}`);
  },
  addAsset: async (asset) => {
    const { data: { session } } = await supabase.auth.getSession();
     const userId = session?.user?.id;
     try {
       const response = await api.post(`/api/assets/`, { 
         ...asset, 
         user_id: userId,
         value: Number(asset.value)
       });
       toast.success('Asset added successfully!');
       return response;
     } catch (error) {
       toast.error('Failed to add asset.');
       console.error('Error adding asset:', error);
       throw error;
     }
   },
  updateAsset: async (id, asset) => {
    const { data: { session } } = await supabase.auth.getSession();
     const userId = session?.user?.id;
     try {
       const response = await api.put(`/api/assets/${userId}/${id}`, {
         ...asset,
         value: Number(asset.value)
       });
       toast.success('Asset updated successfully!');
       return response;
     } catch (error) {
       toast.error('Failed to update asset.');
       console.error('Error updating asset:', error);
       throw error;
     }
   },
  deleteAsset: async (id) => {
    
    return api.delete(`/api/assets/${id}`);
  },
  
  // Liabilities
  getLiabilities: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.get(`/api/liabilities/user/${userId}`);
  },
  addLiability: async (liability) => {
    const { data: { session } } = await supabase.auth.getSession();
     const userId = session?.user?.id;
     try {
       const response = await api.post(`/api/liabilities/`, { 
         ...liability, 
         user_id: userId,
         amount: Number(liability.value)
       });
       toast.success('Liability added successfully!');
       return response;
     } catch (error) {
       toast.error('Failed to add Liability.');
       console.error('Error adding Liability:', error);
       throw error;
     }
  },
  updateLiability: async (id, liability) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.put(`/api/liabilities/${userId}/${id}`, {
      ...liability,
      amount: Number(liability.amount)
    });
  },
  deleteLiability: async (id) => {
    return api.delete(`/api/liabilities/${id}`);
  },
  
  // Net Worth
  getNetWorth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.get(`/api/net-worth/${userId}`);
  },
  updateAssets: async (assets) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.put(`/api/net-worth/${userId}/assets`, assets);
  },
  updateLiabilities: async (liabilities) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    return api.put(`/api/net-worth/${userId}/liabilities`, liabilities);
  },
};

export default api; 