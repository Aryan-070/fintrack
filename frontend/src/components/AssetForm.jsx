import { useState, useEffect } from 'react';
import { useAssets } from '../context/AssetContext'; // You'll need to create this context

const ASSET_TYPES = {
  CASH: 'cash',
  REAL_ESTATE: 'real_estate',
  VEHICLES: 'vehicles',
  INVESTMENTS: 'investments',
  OTHER: 'other',
};

const AssetForm = ({ asset = null, onClose }) => {
  const { addAsset, updateAsset } = useAssets();
  const [form, setForm] = useState({
    asset_type: ASSET_TYPES.CASH,
    asset_name: '',
    value: '',
    acquired_date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (asset) {
      setForm({
        id: asset.id,
        asset_type: asset.asset_type || ASSET_TYPES.CASH,
        asset_name: asset.asset_name || '',
        value: asset.value || '',
        acquired_date: asset.acquired_date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'value' ? (value === '' ? '' : parseFloat(value)) : value,
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.asset_name) newErrors.asset_name = 'Asset name is required';
    if (!form.value || form.value <= 0) newErrors.value = 'Value must be greater than 0';
    if (!form.acquired_date) newErrors.acquired_date = 'Acquisition date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const assetData = {
      asset_type: form.asset_type,
      asset_name: form.asset_name,
      value: Number(form.value),
      acquired_date: form.acquired_date,
    };

    try {
      if (asset) {
        await updateAsset({ ...assetData, id: asset.id });
      } else {
        await addAsset(assetData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save asset. Please try again.' }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {asset ? 'Edit Asset' : 'Add New Asset'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="asset_type">
            Asset Type
          </label>
          <select
            id="asset_type"
            name="asset_type"
            value={form.asset_type}
            onChange={handleChange}
            className="w-full p-2 border rounded border-gray-300"
          >
            {Object.entries(ASSET_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="asset_name">
            Asset Name
          </label>
          <input
            type="text"
            id="asset_name"
            name="asset_name"
            value={form.asset_name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.asset_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.asset_name && <p className="text-red-500 text-sm mt-1">{errors.asset_name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="value">
            Value
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={form.value}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
            min="0"
            step="0.01"
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="acquired_date">
            Acquisition Date
          </label>
          <input
            type="date"
            id="acquired_date"
            name="acquired_date"
            value={form.acquired_date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.acquired_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.acquired_date && <p className="text-red-500 text-sm mt-1">{errors.acquired_date}</p>}
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
            {asset ? 'Update' : 'Add'} Asset
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

export default AssetForm; 