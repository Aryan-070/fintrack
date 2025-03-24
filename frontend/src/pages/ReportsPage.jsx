import { useState, useEffect } from 'react';
import NetWorthCalculator from '../components/NetWorthCalculator';
import AssetForm from '../components/AssetForm';
import LiabilityForm from '../components/LiabilityForm';
import { useAssets } from '../context/AssetContext';
import { useLiabilities } from '../context/LiabilityContext';

// Dummy assets data
const DUMMY_ASSETS = [
  {
    id: 'dummy-asset-1',
    asset_name: 'Checking Account',
    asset_type: 'Cash',
    value: 5000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-asset-2',
    asset_name: 'Savings Account',
    asset_type: 'Cash',
    value: 15000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-asset-3',
    asset_name: 'Investment Portfolio',
    asset_type: 'Investment',
    value: 45000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-asset-4',
    asset_name: 'Home Property',
    asset_type: 'Real Estate',
    value: 350000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-asset-5',
    asset_name: 'Vehicle',
    asset_type: 'Personal Property',
    value: 22000,
    date_added: new Date().toISOString()
  }
];

// Dummy liabilities data
const DUMMY_LIABILITIES = [
  {
    id: 'dummy-liability-1',
    description: 'Mortgage',
    liability_type: 'Secured Loan',
    amount: 280000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-liability-2',
    description: 'Car Loan',
    liability_type: 'Secured Loan',
    amount: 12000,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-liability-3',
    description: 'Credit Card',
    liability_type: 'Revolving Credit',
    amount: 2500,
    date_added: new Date().toISOString()
  },
  {
    id: 'dummy-liability-4',
    description: 'Student Loan',
    liability_type: 'Installment Loan',
    amount: 18000,
    date_added: new Date().toISOString()
  }
];

const ReportsPage = () => {
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const { assets, loading: assetsLoading, error: assetsError } = useAssets();
  const { liabilities, loading: liabilitiesLoading, error: liabilitiesError, fetchLiabilities } = useLiabilities();
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [displayAssets, setDisplayAssets] = useState([]);
  const [displayLiabilities, setDisplayLiabilities] = useState([]);

  useEffect(() => {
    fetchLiabilities();
  }, [fetchLiabilities]);

  // Set up dummy data if needed
  useEffect(() => {
    const hasRealAssets = assets && assets.length > 0;
    const hasRealLiabilities = liabilities && liabilities.length > 0;
    
    // If both assets and liabilities are loaded and at least one is empty
    if (!assetsLoading && !liabilitiesLoading && (!hasRealAssets || !hasRealLiabilities)) {
      setIsUsingDummyData(true);
      setDisplayAssets(hasRealAssets ? assets : DUMMY_ASSETS);
      setDisplayLiabilities(hasRealLiabilities ? liabilities : DUMMY_LIABILITIES);
    } else if (hasRealAssets && hasRealLiabilities) {
      setIsUsingDummyData(false);
      setDisplayAssets(assets);
      setDisplayLiabilities(liabilities);
    }
  }, [assets, liabilities, assetsLoading, liabilitiesLoading]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Loading state
  if (assetsLoading || liabilitiesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  // Error handling
  const error = assetsError || liabilitiesError;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssetForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Asset
          </button>
          <button
            onClick={() => setShowLiabilityForm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Liability
          </button>
        </div>
      </div>

      {isUsingDummyData && (
        <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-semibold">Sample Financial Data</p>
          <p className="text-sm">Displaying example assets and liabilities. Add your own to see your actual financial position.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Net Worth Overview */}
      <div className="mb-8">
        <NetWorthCalculator assets={displayAssets} liabilities={displayLiabilities} />
      </div>

      {/* Assets and Liabilities Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Assets List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Assets</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {displayAssets.length > 0 ? (
                  displayAssets.map((asset) => (
                    <tr key={asset.id} className="border-b">
                      <td className="py-2">{asset.asset_name}</td>
                      <td className="py-2">{asset.asset_type}</td>
                      <td className="py-2 text-right text-green-600">
                        {formatCurrency(asset.value)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No assets found. Add an asset to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liabilities List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Liabilities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayLiabilities.length > 0 ? (
                  displayLiabilities.map((liability) => (
                    <tr key={liability.id} className="border-b">
                      <td className="py-2">{liability.description}</td>
                      <td className="py-2">{liability.liability_type}</td>
                      <td className="py-2 text-right text-red-600">
                        {formatCurrency(liability.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No liabilities found. Add a liability to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Asset Form Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <AssetForm
              onClose={() => {
                setShowAssetForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Liability Form Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <LiabilityForm
              onClose={() => {
                setShowLiabilityForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;