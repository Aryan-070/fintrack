import { useState, useEffect } from 'react';
import { useLiabilities } from '../context/LiabilityContext'; // You'll need to create this context

const LIABILITY_TYPES = {
  CREDIT_CARD: 'credit_card',
  LOAN: 'loan',
  MORTGAGE: 'mortgage',
  OTHER: 'other',
};

const LiabilityForm = ({ liability = null, onClose }) => {
  const { addLiability, updateLiability } = useLiabilities();
  const [form, setForm] = useState({
    liability_type: LIABILITY_TYPES.CREDIT_CARD,
    description: '',
    amount: '',
    due_date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (liability) {
      setForm({
        id: liability.id,
        liability_type: liability.liability_type || LIABILITY_TYPES.CREDIT_CARD,
        description: liability.description || '',
        amount: liability.amount || '',
        due_date: liability.due_date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [liability]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value,
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.amount || form.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.due_date) newErrors.due_date = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const liabilityData = {
      liability_type: form.liability_type,
      description: form.description,
      amount: Number(form.amount),
      due_date: form.due_date,
    };

    try {
      if (liability) {
        await updateLiability({ ...liabilityData, id: liability.id });
      } else {
        await addLiability(liabilityData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving liability:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save liability. Please try again.' }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {liability ? 'Edit Liability' : 'Add New Liability'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="liability_type">
            Liability Type
          </label>
          <select
            id="liability_type"
            name="liability_type"
            value={form.liability_type}
            onChange={handleChange}
            className="w-full p-2 border rounded border-gray-300"
          >
            {Object.entries(LIABILITY_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace('_', ' ')}
              </option>
            ))}
          </select>
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
            min="0"
            step="0.01"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="due_date">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.due_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
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
            {liability ? 'Update' : 'Add'} Liability
          </button>
        </div>

        {errors.submit && (
          <div className="mt-3 text-red-500 text-sm">
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
};

export default LiabilityForm; 