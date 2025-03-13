import { createContext, useContext, useState, useCallback } from 'react';
import { financialService } from '../services/api';

const LiabilityContext = createContext();

export const LiabilityProvider = ({ children }) => {
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiabilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financialService.getLiabilities();
      setLiabilities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch liabilities');
      console.error('Error fetching liabilities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLiability = async (liability) => {
    try {
      setLoading(true);
      const response = await financialService.addLiability(liability);
      setLiabilities(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to add liability');
      console.error('Error adding liability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLiability = async (liability) => {
    try {
      setLoading(true);
      const response = await financialService.updateLiability(liability.id, liability);
      setLiabilities(prev => 
        prev.map(item => item.id === liability.id ? response.data : item)
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to update liability');
      console.error('Error updating liability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLiability = async (id) => {
    try {
      setLoading(true);
      await financialService.deleteLiability(id);
      setLiabilities(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete liability');
      console.error('Error deleting liability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiabilityContext.Provider value={{
      liabilities,
      loading,
      error,
      fetchLiabilities,
      addLiability,
      updateLiability,
      deleteLiability,
    }}>
      {children}
    </LiabilityContext.Provider>
  );
};

export const useLiabilities = () => {
  const context = useContext(LiabilityContext);
  if (!context) {
    throw new Error('useLiabilities must be used within a LiabilityProvider');
  }
  return context;
}; 