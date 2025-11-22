import React from 'react';

interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  disabled?: boolean;
  managerOnly?: boolean;
  isManagerView?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  disabled = false,
  managerOnly = false,
  isManagerView = false
}) => {
  if (managerOnly && !isManagerView) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {managerOnly && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Только менеджер
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};