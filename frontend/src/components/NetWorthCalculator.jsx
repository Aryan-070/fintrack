import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
);

const NetWorthCalculator = ({ assets, liabilities }) => {
  // Calculate totals
  const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value), 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + Number(liability.amount), 0);
  const netWorth = totalAssets - totalLiabilities;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Prepare data for pie chart
  const chartData = {
    labels: ['Assets', 'Liabilities'],
    datasets: [
      {
        data: [totalAssets, totalLiabilities],
        backgroundColor: ['#10B981', '#EF4444'], // green-600 and red-600
        borderColor: ['#059669', '#DC2626'], // green-700 and red-700
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${context.label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Net Worth Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex justify-center items-center">
          <div style={{ width: '300px', height: '300px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Assets</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Liabilities</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Net Worth</h3>
            <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netWorth)}
            </p>
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Asset Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(
            assets.reduce((acc, asset) => {
              acc[asset.asset_type] = (acc[asset.asset_type] || 0) + Number(asset.value);
              return acc;
            }, {})
          ).map(([type, value]) => (
            <div key={type} className="bg-gray-50 rounded p-3">
              <div className="text-sm text-gray-600">{type.replace('_', ' ').toUpperCase()}</div>
              <div className="text-lg font-semibold text-gray-800">{formatCurrency(value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liability Type Breakdown */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Liability Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(
            liabilities.reduce((acc, liability) => {
              acc[liability.liability_type] = (acc[liability.liability_type] || 0) + Number(liability.amount);
              return acc;
            }, {})
          ).map(([type, amount]) => (
            <div key={type} className="bg-gray-50 rounded p-3">
              <div className="text-sm text-gray-600">{type.replace('_', ' ').toUpperCase()}</div>
              <div className="text-lg font-semibold text-gray-800">{formatCurrency(amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetWorthCalculator; 