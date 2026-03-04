import { useState } from 'react';

const SelectWithAdd = ({ 
  name, 
  label, 
  value, 
  options, 
  placeholder, 
  required = true,
  onChange,
  onAddNew,
  disabled = false
}) => {
  const [showNewOption, setShowNewOption] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === '__ADD_NEW__') {
      setShowNewOption(true);
      onChange({ target: { name, value: '' } });
    } else {
      setShowNewOption(false);
      onChange(e);
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) {
      alert('Please enter a value');
      return;
    }

    setSaving(true);
    try {
      await onAddNew(name, newValue);
      setShowNewOption(false);
      setNewValue('');
    } catch (err) {
      console.error('Failed to add:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleSelectChange}
        required={required}
        disabled={disabled}
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
      {showNewOption && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewOption(false);
                setNewValue('');
              }}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithAdd;
