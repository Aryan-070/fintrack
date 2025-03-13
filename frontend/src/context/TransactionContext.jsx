import { createContext, useState, useContext, useEffect } from 'react';
import { TRANSACTION_TYPES } from '../utils/transactionCategories';
import { financialService } from '../services/api';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await financialService.getTransactions();
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      setIsLoading(true);
      const response = await financialService.addTransaction(transaction);
      setTransactions([...transactions, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error adding transaction:", err);
      throw new Error("Failed to add transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (updatedTransaction) => {
    try {
      setIsLoading(true);
      await financialService.updateTransaction(updatedTransaction.id, updatedTransaction);
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        )
      );
    } catch (err) {
      console.error("Error updating transaction:", err);
      throw new Error("Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      setIsLoading(true);
      await financialService.deleteTransaction(id);
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      throw new Error("Failed to delete transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate financial summaries
  const calculateSummary = () => {
    // This will be fetched from the dashboard API
    return null;
  };

  // Get monthly data for charts
  const getMonthlyData = () => {
    // This will be fetched from the dashboard API
    return null;
  };

  // Get expense breakdown by category
  const getExpenseCategories = () => {
    // This will be fetched from the dashboard API
    return null;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        calculateSummary,
        getMonthlyData,
        getExpenseCategories,
        isLoading,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}; 