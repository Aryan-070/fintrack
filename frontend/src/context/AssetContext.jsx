import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { financialService } from '../services/api';
//import { AssetProvider } from '../context/AssetContext';

// Create the AssetContext
const AssetContext = createContext();

// AssetProvider component to wrap around components that need access to asset data
export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch assets from the API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financialService.getAssets();
      setAssets(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assets');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch assets when the component mounts
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const addAsset = async (asset) => {
    try {
      setLoading(true);
      const response = await financialService.addAsset(asset);
      setAssets(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to add asset');
      console.error('Error adding asset:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (asset) => {
    try {
      setLoading(true);
      const response = await financialService.updateAsset(asset.id, asset);
      setAssets(prev => 
        prev.map(item => item.id === asset.id ? response.data : item)
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to update asset');
      console.error('Error updating asset:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id) => {
    try {
      setLoading(true);
      await financialService.deleteAsset(id);
      setAssets(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete asset');
      console.error('Error deleting asset:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Provide the context value
  const contextValue = {
    assets,
    loading,
    error,
    fetchAssets,
    addAsset,
    updateAsset,
    deleteAsset,
  };

  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}; 