import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../utils/transactionCategories';

const TransactionForm = ({ transaction = null, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState({
    transaction_date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
    transaction_type: TRANSACTION_TYPES.EXPENSE,
    category_type: '',
    location : 'Delhi',
    is_recurring: false,
  });
  const [errors, setErrors] = useState({});

  // If editing an existing transaction, populate the form
  useEffect(() => {
    if (transaction) {
      const validType = TRANSACTION_CATEGORIES[transaction.transaction_type] 
        ? transaction.transaction_type 
        : TRANSACTION_TYPES.EXPENSE;
        
      setForm({
        id: transaction.id,
        transaction_date: transaction.date || transaction.transaction_date || new Date().toISOString().slice(0, 10),
        description: transaction.description || '',
        amount: transaction.amount || '',
        transaction_type: validType,
        location: transaction.location || 'Delhi',
        category_type: transaction.category_type || '',
        is_recurring: transaction.is_recurring || false,
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : 
              name === 'amount' ? (value === '' ? '' : parseFloat(value)) : 
              value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.transaction_date) newErrors.transaction_date = 'Date is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.amount || form.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.category_type) newErrors.category_type = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setForm({
      ...form,
      transaction_type: newType,
      category_type: '', // Reset category when type changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Format the data before sending to API
    const transactionData = {
      transaction_date: form.transaction_date,
      description: form.description,
      location: form.location,
      amount: Number(form.amount), // Ensure amount is a number
      transaction_type: form.transaction_type,
      category_type: form.category_type,
      is_recurring: Boolean(form.is_recurring), // Ensure boolean
    };

    try {
      if (transaction) {
        await updateTransaction({ ...transactionData, id: transaction.id });
      } else {
        await addTransaction(transactionData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save transaction. Please try again.'
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Transaction Type</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="transaction_type"
                value={TRANSACTION_TYPES.INCOME}
                checked={form.transaction_type === TRANSACTION_TYPES.INCOME}
                onChange={handleTypeChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Income</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="transaction_type"
                value={TRANSACTION_TYPES.EXPENSE}
                checked={form.transaction_type === TRANSACTION_TYPES.EXPENSE}
                onChange={handleTypeChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Expense</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="transaction_date">
            Date
          </label>
          <input
            type="date"
            id="transaction_date"
            name="transaction_date"
            value={form.transaction_date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.transaction_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.transaction_date && <p className="text-red-500 text-sm mt-1">{errors.transaction_date}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Transaction description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Location"
          />
        
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="category_type">
            Category
          </label>
          <select
            id="category_type"
            name="category_type"
            value={form.category_type}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.category_type ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a category</option>
            {TRANSACTION_CATEGORIES[form.transaction_type]?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_type && <p className="text-red-500 text-sm mt-1">{errors.category_type}</p>}
        </div>
        
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="is_recurring"
              checked={form.is_recurring}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Recurring Transaction</span>
          </label>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {transaction ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
      
      {errors.submit && (
        <div className="mb-4 text-red-500 text-sm">
          {errors.submit}
        </div>
      )}
    </div>
  );
};

export default TransactionForm; 