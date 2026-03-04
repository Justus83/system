import React, { useState, useEffect } from 'react';

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Add Product',
  fields = [],
  initialData = {},
  suppliers = [],
  saving = false,
  onEnumAdded,
  error = null,
  storeId,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [newOptions, setNewOptions] = useState({
    brand: '',
    ramSize: '',
    storageSize: '',
    model: '',
    color: '',
    screenSize: '',
    tvType: '',
    size: '',
    spiritSize: '',
    type: '',
    year: '',
    wineSize: '',
    wineType: '',
    wineYear: '',
    champagneSize: '',
    juiceSize: '',
    softDrinkType: '',
    softDrinkSize: '',
    packaging: ''
  });
  const [showNewOption, setShowNewOption] = useState({
    brand: false,
    ramSize: false,
    storageSize: false,
    model: false,
    color: false,
    screenSize: false,
    tvType: false,
    size: false,
    spiritSize: false,
    type: false,
    year: false,
    wineSize: false,
    wineType: false,
    wineYear: false,
    champagneSize: false,
    juiceSize: false,
    softDrinkType: false,
    softDrinkSize: false,
    packaging: false
  });
  const [savingNew, setSavingNew] = useState(false);

  // Get current sourceType from formData
  const currentSourceType = formData.sourceType || 'SUPPLIER';

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Show new option input when "Add New" option is selected
    if (value === '__ADD_NEW__') {
      setShowNewOption(prev => ({ ...prev, [name]: true }));
    } else if (name === 'brand' || name === 'ramSize' || name === 'storageSize' || name === 'model' || name === 'color' || name === 'screenSize' || name === 'tvType' || name === 'size' || name === 'spiritSize' || name === 'type' || name === 'year' || name === 'wineSize' || name === 'wineType' || name === 'wineYear' || name === 'champagneSize' || name === 'juiceSize' || name === 'softDrinkType' || name === 'softDrinkSize' || name === 'packaging') {
      setShowNewOption(prev => ({ ...prev, [name]: false }));
    }

    // Clear supplierId when sourceType changes away from SUPPLIER
    if (name === 'sourceType') {
      if (value !== 'SUPPLIER') {
        setFormData(prev => ({ ...prev, supplierId: '' }));
      }
    }
  };

  const handleAddNewOption = async (type) => {
    const displayName = newOptions[type];
    if (!displayName) {
      alert('Please enter a display name');
      return;
    }

    setSavingNew(true);
    try {
      const token = localStorage.getItem('token');
      
      // Electronic products enum endpoints
      const electronicEndpointMap = {
        brand: '/api/enums/brands',
        ramSize: '/api/enums/ram-sizes',
        storageSize: '/api/enums/storage-sizes',
        model: '/api/enums/models',
        color: '/api/enums/colors',
        screenSize: '/api/enums/screen-sizes',
        resolution: '/api/enums/resolutions',
        tvType: '/api/enums/tv-types'
      };

      // Bar products enum endpoints
      const barEndpointMap = {
        brand: '/api/enums/brands',
        size: '/api/beer-sizes',
        spiritSize: '/api/spirit-sizes',
        type: '/api/spirit-types',
        year: '/api/spirit-years',
        wineSize: '/api/wine-sizes',
        wineType: '/api/wine-types',
        wineYear: '/api/wine-years',
        champagneSize: '/api/champagne-sizes',
        juiceSize: '/api/juice-sizes',
        softDrinkType: '/api/soft-drink-types',
        softDrinkSize: '/api/soft-drink-sizes',
        packaging: '/api/packaging'
      };

      // Determine which endpoint to use based on field type
      let endpoint;
      if (barEndpointMap[type]) {
        endpoint = barEndpointMap[type];
      } else {
        endpoint = electronicEndpointMap[type];
      }

      if (!endpoint) {
        alert('Unsupported enum type');
        return;
      }

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: displayName, storeId })
      });
      
      if (response.ok) {
        const newOption = await response.json();
        console.log('New enum added:', type, 'Value:', newOption);
        
        // For bar products, use the name directly; for electronic products, use the id
        const valueToSet = barEndpointMap[type] ? newOption.name : newOption.id;
        
        setFormData(prev => ({ ...prev, [type]: valueToSet }));
        setShowNewOption(prev => ({ ...prev, [type]: false }));
        setNewOptions(prev => ({ ...prev, [type]: '' }));
        
        // Notify parent that a new enum was added so it can refresh options
        if (onEnumAdded) {
          onEnumAdded(type);
        }
      } else {
        const error = await response.json();
        alert(error.error || error.message || 'Failed to add new option');
      }
    } catch (err) {
      console.error('Failed to add new option:', err);
      alert('Failed to add new option');
    } finally {
      setSavingNew(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Check if a field should be shown based on sourceType
  const shouldShowField = (fieldName) => {
    if (fieldName === 'supplierId') {
      return currentSourceType === 'SUPPLIER';
    }
    if (fieldName === 'sourceName' || fieldName === 'sourcePhone' || fieldName === 'otherSourceName' || fieldName === 'otherSourcePhoneNumber') {
      return currentSourceType === 'OTHER';
    }
    return true;
  };

  const renderField = (field) => {
    // Normalize the value by converting enum formats if needed
    const normalizeValue = (val) => {
      if (!val) return '';
      // Ensure val is a string before calling startsWith
      const strVal = String(val);
      // Convert from "GB_16" to "16GB_" if enum format is "16GB_"
      if (strVal.startsWith('GB_')) {
        const numberPart = strVal.replace('GB_', '');
        return `${numberPart}GB_`;
      }
      // Convert from "TB_1" to "1TB_" if enum format is "1TB_"
      if (strVal.startsWith('TB_')) {
        const numberPart = strVal.replace('TB_', '');
        return `${numberPart}TB_`;
      }
      return val; // Return original value (number or string)
    };
    
    const inputValue = formData[field.name];
    const value = inputValue !== undefined && inputValue !== null ? normalizeValue(inputValue) : '';
    
    // Debugging logs
    if (['storageSize', 'ramSize', 'brand', 'type', 'size', 'wineType', 'wineSize'].includes(field.name)) {
      console.log(`Processing ${field.name}:`, {
        inputValue,
        normalizedValue: value,
        options: field.options
      });
    }

    switch (field.type) {
      case 'select':
        return (
          <div>
            <select
              name={field.name}
              value={value}
              onChange={handleInputChange}
              required={field.required}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{field.placeholder || 'Select...'}</option>
              {field.options?.map(option => (
                <option 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
              {(field.name === 'brand' || field.name === 'ramSize' || field.name === 'storageSize' || field.name === 'model' || field.name === 'color' || field.name === 'screenSize' || field.name === 'resolution' || field.name === 'tvType' || field.name === 'size' || field.name === 'spiritSize' || field.name === 'type' || field.name === 'year' || field.name === 'wineSize' || field.name === 'wineType' || field.name === 'wineYear' || field.name === 'champagneSize' || field.name === 'juiceSize' || field.name === 'softDrinkType' || field.name === 'softDrinkSize' || field.name === 'packaging') && (
                <option value="__ADD_NEW__">+ Add New {field.label}</option>
              )}
            </select>
            {showNewOption[field.name] && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add New {field.label}</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newOptions[field.name] || ''}
                    onChange={(e) => setNewOptions({
                      ...newOptions,
                      [field.name]: e.target.value
                    })}
                    placeholder={`Enter ${field.label} (e.g., "Samsung" or "8GB" or "256GB" or "iPhone 15" or "Blue")`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleAddNewOption(field.name)}
                      disabled={savingNew}
                      className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      {savingNew ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewOption(prev => ({ ...prev, [field.name]: false }));
                        setFormData({ ...formData, [field.name]: '' });
                      }}
                      className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={value}
            onChange={handleInputChange}
            step={field.step || '0.01'}
            required={field.required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        );
      default:
        return (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={value}
            onChange={handleInputChange}
            required={field.required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        );
    }
  };

  if (!isOpen) return null;

  // Filter fields based on current sourceType selection
  const filteredFields = fields.filter(field => shouldShowField(field.name));

  // Group fields into rows (2 fields per row)
  const fieldRows = [];
  for (let i = 0; i < filteredFields.length; i += 2) {
    fieldRows.push(filteredFields.slice(i, i + 2));
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {fieldRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex space-x-4">
                    {row.map(field => (
                      <div key={field.name} className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label} {field.required && '*'}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
