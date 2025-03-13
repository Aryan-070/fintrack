import { useState, useEffect } from 'react';
import NetWorthCalculator from '../components/NetWorthCalculator';
import AssetForm from '../components/AssetForm';
import LiabilityForm from '../components/LiabilityForm';
import { useAssets } from '../context/AssetContext';
import { useLiabilities } from '../context/LiabilityContext';

const ReportsPage = () => {
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const { assets, loading, error } = useAssets();
  const { liabilities, fetchLiabilities } = useLiabilities();

  useEffect(() => {
    fetchLiabilities();
  }, [fetchLiabilities]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

      {/* Net Worth Overview */}
      <div className="mb-8">
        <NetWorthCalculator assets={assets} liabilities={liabilities} />
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
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b">
                    <td className="py-2">{asset.asset_name}</td>
                    <td className="py-2">{asset.asset_type}</td>
                    <td className="py-2 text-right text-green-600">
                      {formatCurrency(asset.value)}
                    </td>
                  </tr>
                ))}
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
                {liabilities.map((liability) => (
                  <tr key={liability.id} className="border-b">
                    <td className="py-2">{liability.description}</td>
                    <td className="py-2">{liability.liability_type}</td>
                    <td className="py-2 text-right text-red-600">
                      {formatCurrency(liability.amount)}
                    </td>
                  </tr>
                ))}
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