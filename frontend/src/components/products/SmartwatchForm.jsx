import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import SelectWithAdd from './SelectWithAdd';

const SmartwatchForm = ({ storeId, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    caseSizeMM: '',
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
    colors: [],
    sources: [],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEnums();
    fetchSuppliers();
  }, []);

  const fetchEnums = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [brandsRes, modelsRes, colorRes, sourceRes] = await Promise.all([
        fetch(`http://localhost:5001/api/enums/brands?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/models?storeId=${storeId}`, { headers }),
        fetch(`http://localhost:5001/api/enums/colors?storeId=${storeId}`, { headers }),
        fetch('http://localhost:5001/api/enums/source-types', { headers })
      ]);
      
      const brands = brandsRes.ok ? await brandsRes.json() : [];
      const models = modelsRes.ok ? await modelsRes.json() : [];
      const colors = colorRes.ok ? await colorRes.json() : [];
      const sources = sourceRes.ok ? await sourceRes.json() : [];
      
      setEnumOptions({ brands, models, colors, sources });
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewEnum = async (fieldName, value) => {
    const token = localStorage.getItem('token');
    const endpointMap = {
      brand: '/api/enums/brands',
      model: '/api/enums/models',
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
      await fetchEnums();
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add new option');
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
        caseSizeMM: formData.caseSizeMM ? parseInt(formData.caseSizeMM) : null,
        color: formData.color,
        costPrice: parseFloat(formData.costPrice) || 0,
        storeId: storeId,
        sourceType: formData.sourceType,
        supplierId: formData.sourceType === 'SUPPLIER' ? parseInt(formData.supplierId) : null,
        otherSourceName: formData.sourceType !== 'SUPPLIER' ? formData.sourceName : null,
        otherSourcePhoneNumber: formData.sourceType !== 'SUPPLIER' ? formData.sourcePhone : null,
      };
      
      await productsAPI.createSmartwatch(payload);
      
      setFormData({
        brand: '',
        model: '',
        serialNumber: '',
        caseSizeMM: '',
        color: '',
        costPrice: '',
        sourceType: 'SUPPLIER',
        supplierId: '',
        sourceName: '',
        sourcePhone: '',
      });
      
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add smartwatch:', err);
      onError?.(err.message || 'Failed to add smartwatch');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectWithAdd
          name="brand"
          label="Brand"
          value={formData.brand}
          options={enumOptions.brands}
          placeholder="Select Brand"
          onChange={handleChange}
          onAddNew={handleAddNewEnum}
        />

        <SelectWithAdd
          name="model"
          label="Model"
          value={formData.model}
          options={enumOptions.models}
          placeholder="Select Model"
          onChange={handleChange}
          onAddNew={handleAddNewEnum}
        />

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
            Case Size (mm)
          </label>
          <input
            type="number"
            name="caseSizeMM"
            value={formData.caseSizeMM}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <SelectWithAdd
          name="color"
          label="Color"
          value={formData.color}
          options={enumOptions.colors}
          placeholder="Select Color"
          onChange={handleChange}
          onAddNew={handleAddNewEnum}
        />

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
          {saving ? 'Adding...' : 'Add Smartwatch'}
        </button>
      </div>
    </form>
  );
};

export default SmartwatchForm;
