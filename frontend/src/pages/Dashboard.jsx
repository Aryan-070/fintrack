import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import TransactionList from '../components/TransactionList';
import { financialService } from '../services/api';
import { TRANSACTION_CATEGORIES } from '../utils/transactionCategories';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define dummy data to use when API data is not available
const DUMMY_DATA = {
  totalIncome: 12000,
  totalExpenses: 8500,
  netWorth: 3500,
  monthlyData: [
    { month: 'Jan', income: 2000, expense: 1500 },
    { month: 'Feb', income: 2200, expense: 1600 },
    { month: 'Mar', income: 1800, expense: 1400 },
    { month: 'Apr', income: 2100, expense: 1700 },
    { month: 'May', income: 2300, expense: 1800 },
    { month: 'Jun', income: 1600, expense: 500 },
  ],
  expenseCategories: [
    { category: 'housing', amount: 3000 },
    { category: 'food', amount: 1500 },
    { category: 'transportation', amount: 1000 },
    { category: 'utilities', amount: 800 },
    { category: 'entertainment', amount: 700 },
    { category: 'healthcare', amount: 500 },
    { category: 'education', amount: 400 },
    { category: 'other', amount: 600 }
  ]
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(DUMMY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await financialService.getDashboardData();
        
        // Check if response data exists and has valid content
        if (response.data && 
            Object.keys(response.data).length > 0 && 
            response.data.monthlyData && 
            response.data.monthlyData.length > 0 &&
            response.data.expenseCategories &&
            response.data.expenseCategories.length > 0) {
          setDashboardData(response.data);
          setIsUsingDummyData(false);
        } else {
          console.log('API returned empty data, using dummy data instead');
          setDashboardData(DUMMY_DATA);
          setIsUsingDummyData(true);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Using sample data instead.');
        setDashboardData(DUMMY_DATA);
        setIsUsingDummyData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { totalIncome, totalExpenses, netWorth, monthlyData, expenseCategories } = dashboardData;

  // Prepare data for Income vs Expenses chart
  const incomeExpensesChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(data => data.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  // Get category names for the pie chart
  const getCategoryName = (categoryId) => {
    try {
      const allCategories = TRANSACTION_CATEGORIES.expense || [];
      const category = allCategories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    } catch (err) {
      console.error('Error getting category name:', err);
      return categoryId;
    }
  };

  // Prepare data for Expense Breakdown chart
  const expenseBreakdownChartData = {
    labels: expenseCategories.map(item => getCategoryName(item.category)),
    datasets: [
      {
        label: 'Expenses by Category',
        data: expenseCategories.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(255, 99, 64, 0.6)',
          'rgba(178, 199, 199, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses (Last 6 Months)',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expense Breakdown by Category',
      },
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
      
      {isUsingDummyData && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
          <p className="font-bold">Notice</p>
          <p>Displaying sample data. Connect your accounts to see your actual financial information.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-400 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Income</h2>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-yellow-400 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-yellow-400 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Net Worth</h2>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(netWorth)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Bar data={incomeExpensesChartData} options={barChartOptions} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Pie data={expenseBreakdownChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList />
    </div>
  );
};

export default Dashboard; 