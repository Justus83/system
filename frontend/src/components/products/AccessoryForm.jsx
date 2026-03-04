import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import SelectWithAdd from './SelectWithAdd';

const AccessoryForm = ({ storeId, branchId = null, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    brand: '',
    category: '',
    quantity: 1,
    costPrice: '',
    sourceType: 'SUPPLIER',
    supplierId: '',
    otherSourceName: '',
    otherSourcePhoneNumber: '',
  });
  const [enumOptions, setEnumOptions] = useState({
    brands: [],
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
      
      const [brandsRes, sourceRes] = await Promise.all([
        fetch(`http://localhost:5001/api/enums/brands?storeId=${storeId}`, { headers }),
        fetch('http://localhost:5001/api/enums/source-types', { headers })
      ]);
      
      const brands = brandsRes.ok ? await brandsRes.json() : [];
      const sources = sourceRes.ok ? await sourceRes.json() : [];
      
      setEnumOptions({ brands, sources });
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
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        storeId: storeId,
        branchId: branchId || null,
        sourceType: formData.sourceType,
        supplierId: formData.sourceType === 'SUPPLIER' ? parseInt(formData.supplierId) : null,
        otherSourceName: formData.sourceType === 'OTHER' ? formData.otherSourceName : null,
        otherSourcePhoneNumber: formData.sourceType === 'OTHER' ? formData.otherSourcePhoneNumber : null,
      };
      
      await productsAPI.createAccessory(payload);
      
      setFormData({
        brand: '',
        category: '',
        quantity: 1,
        costPrice: '',
        sourceType: 'SUPPLIER',
        supplierId: '',
        otherSourceName: '',
        otherSourcePhoneNumber: '',
      });
      
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add accessory:', err);
      onError?.(err.message || 'Failed to add accessory');
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Enter category (e.g., Charger, Case, Headphones)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cost Price
          </label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
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
        ) : formData.sourceType === 'OTHER' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source Name
              </label>
              <input
                type="text"
                name="otherSourceName"
                value={formData.otherSourceName}
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
                name="otherSourcePhoneNumber"
                value={formData.otherSourcePhoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add Accessory'}
        </button>
      </div>
    </form>
  );
};

export default AccessoryForm;
