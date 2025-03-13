import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { TRANSACTION_CATEGORIES, getCategoryNameById } from '../utils/transactionCategories';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Update filtered transactions whenever transactions or filter changes
  useEffect(() => {
    // Apply filtering
    const filtered = transactions.filter(transaction => {
      // For debugging - log the first transaction to see its structure
      if (transactions.length > 0 && !window.transactionLogged) {
        console.log('First transaction structure:', transactions[0]);
        window.transactionLogged = true;
      }
      
      if (filter === 'all') return true;
      
      // Check both transaction.type and transaction.transaction_type
      const transactionType = transaction.type || transaction.transaction_type;
      return transactionType === filter;
    });
    
    setFilteredTransactions(filtered);
  }, [transactions, filter]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      // Ensure the dateString is properly parsed from ISO format
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Invalid date';
      }
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'Unknown date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get transaction type safely
  const getTransactionType = (transaction) => {
    return transaction.type || transaction.transaction_type || 'unknown';
  };

  // Get category safely
  const getCategory = (transaction) => {
    return transaction.category || transaction.category_type || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`px-3 py-1 rounded ${
            filter === 'income' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`px-3 py-1 rounded ${
            filter === 'expense' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-200'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Debug info */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => {
              const type = getTransactionType(transaction);
              const category = getCategory(transaction);
              
              return (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.transaction_date || transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategoryNameById(type, category)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Transaction Modal */}
      {(isAddingNew || editingTransaction) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <TransactionForm
              transaction={editingTransaction}
              onClose={() => {
                setIsAddingNew(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList; 