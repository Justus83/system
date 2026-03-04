import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';

const LaptopForm = ({ storeId, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    storageSize: '',
    ramSize: '',
    color: '',
    costPrice: '',
    sourceType: 'SUPPLIER',
    supplierId: '',
    sourceName: '',
    sourcePhone: '',
  });
  const [enumOptions, setEnumOptions] = useState({
    brands: [],
    models: [],
    storage: [],
    ram: [],
    colors: [],
    sources: [],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showNewOption, setShowNewOption] = useState({
    brand: false,
    model: false,
    storageSize: false,
    ramSize: false,
    color: false,
  });
  const [newOptionValue, setNewOptionValue] = useState({
    brand: '',
    model: '',
    storageSize: '',
    ramSize: '',
    color: '',
  });
  const [savingNewOption, setSavingNewOption] = useState(false);

  useEffect(() => {
    fetchEnums();
    fetchSuppliers();
  }, []);

  const fetchEnums = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [brandsRes, modelsRes, storageRes, ramRes, colorRes, sourceRes] = await Promise.all([
        fetch(`http://localhost:5001/api/enums/brands?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/models?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/storage-sizes?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/ram-sizes?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/colors?storeId=${storeId}`, { headers }),
        fetch('http://localhost:5001/api/enums/source-types', { headers })
      ]);
      
      const brands = brandsRes.ok ? await brandsRes.json() : [];
      const models = modelsRes.ok ? await modelsRes.json() : [];
      const storage = storageRes.ok ? await storageRes.json() : [];
      const ram = ramRes.ok ? await ramRes.json() : [];
      const colors = colorRes.ok ? await colorRes.json() : [];
      const sources = sourceRes.ok ? await sourceRes.json() : [];
      
      setEnumOptions({ brands, models, storage, ram, colors, sources });
    } catch (err) {
      console.error('Failed to fetch enums:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/suppliers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (value === '__ADD_NEW__') {
      setShowNewOption(prev => ({ ...prev, [name]: true }));
      setFormData(prev => ({ ...prev, [name]: '' }));
    } else {
      setShowNewOption(prev => ({ ...prev, [name]: false }));
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewOption = async (fieldName) => {
    const value = newOptionValue[fieldName];
    if (!value.trim()) {
      alert('Please enter a value');
      return;
    }

    setSavingNewOption(true);
    try {
      const token = localStorage.getItem('token');
      const endpointMap = {
        brand: '/api/enums/brands',
        model: '/api/enums/models',
        storageSize: '/api/enums/storage-sizes',
        ramSize: '/api/enums/ram-sizes',
        color: '/api/enums/colors',
      };

      const response = await fetch(`http://localhost:5001${endpointMap[fieldName]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: value, storeId })
      });

      if (response.ok) {
        const newOption = await response.json();
        setFormData(prev => ({ ...prev, [fieldName]: newOption.name }));
        setShowNewOption(prev => ({ ...prev, [fieldName]: false }));
        setNewOptionValue(prev => ({ ...prev, [fieldName]: '' }));
        await fetchEnums();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add new option');
      }
    } catch (err) {
      console.error('Failed to add new option:', err);
      alert('Failed to add new option');
    } finally {
      setSavingNewOption(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        storageSize: formData.storageSize,
        ramSize: formData.ramSize,
        color: formData.color,
        costPrice: parseFloat(formData.costPrice) || 0,
        storeId: storeId,
        sourceType: formData.sourceType,
        supplierId: formData.sourceType === 'SUPPLIER' ? parseInt(formData.supplierId) : null,
        otherSourceName: formData.sourceType !== 'SUPPLIER' ? formData.sourceName : null,
        otherSourcePhoneNumber: formData.sourceType !== 'SUPPLIER' ? formData.sourcePhone : null,
      };
      
      await productsAPI.createLaptop(payload);
      
      setFormData({
        brand: '',
        model: '',
        serialNumber: '',
        storageSize: '',
        ramSize: '',
        color: '',
        costPrice: '',
        sourceType: 'SUPPLIER',
        supplierId: '',
        sourceName: '',
        sourcePhone: '',
      });
      
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add laptop:', err);
      onError?.(err.message || 'Failed to add laptop');
    } finally {
      setSaving(false);
    }
  };

  const renderSelectWithAdd = (name, label, options, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} *
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.name || opt.value} value={opt.name || opt.value}>
            {opt.displayName || opt.name || opt.label}
          </option>
        ))}
        <option value="__ADD_NEW__">+ Add New {label}</option>
      </select>
      {showNewOption[name] && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            type="text"
            value={newOptionValue[name]}
            onChange={(e) => setNewOptionValue(prev => ({ ...prev, [name]: e.target.value }))}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAddNewOption(name)}
              disabled={savingNewOption}
              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {savingNewOption ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowNewOption(prev => ({ ...prev, [name]: false }))}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelectWithAdd('brand', 'Brand', enumOptions.brands, 'Select Brand')}
        {renderSelectWithAdd('model', 'Model', enumOptions.models, 'Select Model')}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Serial Number *
          </label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {renderSelectWithAdd('storageSize', 'Storage', enumOptions.storage, 'Select Storage')}
        {renderSelectWithAdd('ramSize', 'RAM', enumOptions.ram, 'Select RAM')}
        {renderSelectWithAdd('color', 'Color', enumOptions.colors, 'Select Color')}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cost Price *
          </label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source Type *
          </label>
          <select
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            {enumOptions.sources.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {formData.sourceType === 'SUPPLIER' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier
            </label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source Name
              </label>
              <input
                type="text"
                name="sourceName"
                value={formData.sourceName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source Phone
              </label>
              <input
                type="text"
                name="sourcePhone"
                value={formData.sourcePhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add Laptop'}
        </button>
      </div>
    </form>
  );
};

export default LaptopForm;
