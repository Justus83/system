import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';

const SmartphoneForm = ({ storeId, onSuccess, onError }) => {
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
      
      await productsAPI.createSmartphone(payload);
      
      // Reset form
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
      console.error('Failed to add smartphone:', err);
      onError?.(err.message || 'Failed to add smartphone');
    } finally {
      setSaving(false);
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
        await fetchEnums(); // Refresh the options
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand *
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Brand</option>
            {enumOptions.brands.map(b => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
            <option value="__ADD_NEW__">+ Add New Brand</option>
          </select>
          {showNewOption.brand && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <input
                type="text"
                value={newOptionValue.brand}
                onChange={(e) => setNewOptionValue(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name"
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNewOption('brand')}
                  disabled={savingNewOption}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingNewOption ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOption(prev => ({ ...prev, brand: false }))}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Model *
          </label>
          <select
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Model</option>
            {enumOptions.models.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
            <option value="__ADD_NEW__">+ Add New Model</option>
          </select>
          {showNewOption.model && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <input
                type="text"
                value={newOptionValue.model}
                onChange={(e) => setNewOptionValue(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Enter model name"
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNewOption('model')}
                  disabled={savingNewOption}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingNewOption ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOption(prev => ({ ...prev, model: false }))}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Storage *
          </label>
          <select
            name="storageSize"
            value={formData.storageSize}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Storage</option>
            {enumOptions.storage.map(s => (
              <option key={s.name} value={s.name}>{s.displayName}</option>
            ))}
            <option value="__ADD_NEW__">+ Add New Storage</option>
          </select>
          {showNewOption.storageSize && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <input
                type="text"
                value={newOptionValue.storageSize}
                onChange={(e) => setNewOptionValue(prev => ({ ...prev, storageSize: e.target.value }))}
                placeholder="e.g., 512GB or 1TB"
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNewOption('storageSize')}
                  disabled={savingNewOption}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingNewOption ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOption(prev => ({ ...prev, storageSize: false }))}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            RAM *
          </label>
          <select
            name="ramSize"
            value={formData.ramSize}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select RAM</option>
            {enumOptions.ram.map(r => (
              <option key={r.name} value={r.name}>{r.displayName}</option>
            ))}
            <option value="__ADD_NEW__">+ Add New RAM</option>
          </select>
          {showNewOption.ramSize && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <input
                type="text"
                value={newOptionValue.ramSize}
                onChange={(e) => setNewOptionValue(prev => ({ ...prev, ramSize: e.target.value }))}
                placeholder="e.g., 8GB or 16GB"
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNewOption('ramSize')}
                  disabled={savingNewOption}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingNewOption ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOption(prev => ({ ...prev, ramSize: false }))}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color *
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Color</option>
            {enumOptions.colors.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
            <option value="__ADD_NEW__">+ Add New Color</option>
          </select>
          {showNewOption.color && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <input
                type="text"
                value={newOptionValue.color}
                onChange={(e) => setNewOptionValue(prev => ({ ...prev, color: e.target.value }))}
                placeholder="Enter color name"
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNewOption('color')}
                  disabled={savingNewOption}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingNewOption ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOption(prev => ({ ...prev, color: false }))}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

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
          {saving ? 'Adding...' : 'Add Smartphone'}
        </button>
      </div>
    </form>
  );
};

export default SmartphoneForm;
